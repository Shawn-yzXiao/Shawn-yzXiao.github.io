import type { ComponentType, SVGProps } from "react";
import { BriefcaseBusiness, GraduationCap, Mail, MessageCircle } from "lucide-react";

const icons = {
  email: Mail,
  linkedin: BriefcaseBusiness,
  scholar: GraduationCap,
  talk: MessageCircle,
} satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

type ProfileIconLinkProps = {
  href: string;
  icon: keyof typeof icons;
  children: React.ReactNode;
  className?: string;
};

export function ProfileIconLink({ href, icon, children, className }: ProfileIconLinkProps) {
  const Icon = icons[icon];
  const classes = ["profile-icon-link", className].filter(Boolean).join(" ");

  return (
    <a className={classes} href={href}>
      <span className="profile-link-icon" aria-hidden="true">
        <Icon size={14} strokeWidth={1.75} />
      </span>
      <span>{children}</span>
    </a>
  );
}
