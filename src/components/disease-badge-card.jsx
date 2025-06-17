import { Badge } from "@/components/ui/badge";
import { diseases } from "@/data";

export default function DiseaseBadgeGrid() {
  return (
    <div className="">
      <div className="flex flex-wrap gap-4">
        {diseases.map((disease, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="h-4 w-4 rounded-full shadow-sm"
              style={{ backgroundColor: disease.value }}
            />
            <Badge
              variant="secondary"
              className=""
              style={{
                backgroundColor: `${disease.value}20`,
                color: disease.value,
                borderColor: disease.value,
              }}
            >
              {disease.label}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
