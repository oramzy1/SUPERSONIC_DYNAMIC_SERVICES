import { Link } from "@tanstack/react-router";
import logo from "@/assets/images/logo.png";
import { ArrowLeft } from "lucide-react";

function Logo() {
  return (
     <Link
  to="/"
  className="group relative flex h-10 shrink-0 items-center"
>
  {/* Logo - visible by default, fades/shrinks out on hover */}
  <img
    src={logo}
    alt="Supersonic Dynamic Services"
    className="h-16 w-auto rounded-md opacity-100 transition-all duration-300 ease-out group-hover:scale-90 group-hover:opacity-0"
  />

  {/* Arrow + text - hidden by default, fades/grows in on hover, same slot */}
  <span className="absolute inset-0 flex items-center gap-2 opacity-0 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100">
    <ArrowLeft className="h-4 w-4 text-foreground" />
    <span className="whitespace-nowrap text-sm font-medium text-foreground">
      Return Home
    </span>
  </span>
</Link>
  )
}

export default Logo