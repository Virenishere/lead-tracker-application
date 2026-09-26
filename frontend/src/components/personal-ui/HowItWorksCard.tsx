import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";

export const HowItWorksCard = () => {
  const steps = [
    {
      step: "01",
      title: "Add your leads",
      description: "Enter lead details and keep everything structured in one place.",
    },
    {
      step: "02",
      title: "Track interactions",
      description: "Update lead status as conversations and follow-ups progress.",
    },
    {
      step: "03",
      title: "Convert opportunities",
      description: "Focus on qualified leads and move them towards successful conversion.",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
          How It Works
        </h2>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          Three simple steps to streamline your lead management workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => (
          <Card key={item.step} className="relative overflow-hidden border border-border bg-card hover:border-foreground/40 transition-colors">
            <CardHeader className="p-6">
              <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-foreground text-background w-max mb-3">
                STEP {item.step}
              </div>
              <CardTitle className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

