import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// export default function InputEndPrefix({ type, label, placeholder, ...props }) {
//   return (
//     <div className="group relative">
//       <label
//         htmlFor="input-32"
//         className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
//       >
//         <span className="inline-flex bg-background px-2">{label}</span>
//       </label>
//       <Input
//         id="input-32"
//         className="-me-px rounded-e-none shadow-none"
//         {...props}
//         // placeholder={placeholder}
//       />
//       {/* <span className="z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
//         Minute
//       </span> */}
//     </div>
//   );
// }

export default function InputEndPrefix({ label, placeholder, ...props }) {
  return (
    <div className="group relative">
      <label
        htmlFor="input-32"
        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
      >
        <span className="inline-flex bg-background px-2">{label}</span>
      </label>
      <Input id="input-32" placeholder="" {...props} />
    </div>
  );
}
