import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          backgroundColor: "#fffffa",
          color: "#000000",
          borderColor: "#11146b",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
