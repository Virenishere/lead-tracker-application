import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardFeatures() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Organize Leads</CardTitle>
          <CardDescription>
            Keep all your lead information structured and easy to access.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Track Progress</CardTitle>
          <CardDescription>
            Know exactly where every lead stands in your sales pipeline.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Never Miss a Follow-up</CardTitle>
          <CardDescription>
            Keep track of upcoming calls, meetings, and follow-ups.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Understand Your Pipeline</CardTitle>
          <CardDescription>
            Get a quick overview of your leads and conversion progress.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}