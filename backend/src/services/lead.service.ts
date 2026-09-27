import { LeadStatus } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import ErrorList, { ERROR_CODES, HTTP_STATUS } from "../utils/ErrorList.js";

/**
 * Interface for GetLeadsInput query parameters
 */
interface GetLeadsInput {
  userId: string;
  search?: string;
  status?: LeadStatus;
  sortBy?: "name" | "email" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Retrieves all leads belonging to a specific user with pagination, search, & sorting
 */
export const getLeads = async ({userId,search,status,sortBy = "createdAt",sortOrder = "desc",page = 1,
  limit = 10,} : GetLeadsInput) =>{
  const skip = (page - 1) * limit;

  const validStatuses = Object.values(LeadStatus);
  const effectiveStatus = (status && validStatuses.includes(status as LeadStatus)) ? (status as LeadStatus) : undefined;
  const cleanedSearch = search && search.trim() !== "" ? search.trim() : undefined;

  const where = {
    userId,

    ...(cleanedSearch && {
      OR: [
        {
          name: {
            contains: cleanedSearch,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: cleanedSearch,
            mode: "insensitive" as const,
          },
        },
        {
          phone: {
            contains: cleanedSearch,
          },
        },
      ],
    }),

    ...(effectiveStatus && {
      status: effectiveStatus,
    }),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.lead.count({
      where,
    }),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * retreives leads by id
 */
export const getLeadsById = async (leadId: string, userId: string) => {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
            userId
        }
    })

  if (!lead) {
    throw new AppError(
      "Lead not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  return lead;
}  

/**
 * interface for createLeadInput 
 */
interface CreateLeadsInput{
    name: string,
    email: string,
    phone: string,
    userId: string
}

/**
 * create a new lead for each new user
 */
export const createLead = async ({name,email,phone,userId,}: CreateLeadsInput) => {
  return await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      userId,
    },
  });
};


/**
 * interface for updateLeadsById puting optional conditional as it might or might not changed
 */
interface UpdateLeadInput{
    name ?: string; 
    email ?: string;
    phone ?: string;
}

/**
 * update a lead by id 
 */
export const updateLeadsById = async (leadId:string , userId: string ,data: UpdateLeadInput) =>{
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      userId,
    },
  });

  if (!lead) {
    throw new AppError(
      "Lead not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
    },
  });

  return updatedLead;
};

/**
 * update status of lead
 */
export const updateLeadStatus = async (leadId: string, userId: string, status: LeadStatus) => {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      userId,
    },
  });

  if (!lead) {
    throw new AppError(
      "Lead not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      status,
    },
  });

  return updatedLead;
};

/**
 * delete lead by id
 */
export const deleteLeadsById = async (leadId: string, userId: string) =>{
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      userId,
    },
  });

  if (!lead) {
    throw new AppError(
      "Lead not found",
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  await prisma.lead.delete({
    where: {
      id: leadId,
    },
  });

  return {
    message: "Lead deleted successfully",
  };
};
