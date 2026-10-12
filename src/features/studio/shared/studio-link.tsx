"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useStudio } from "./studio-provider";
export function StudioLink(props: ComponentProps<typeof Link>) {
  const { beforeNavigate } = useStudio();
  const router = useRouter();
  return (
    <Link
      {...props}
      onNavigate={(event) => {
        event.preventDefault();
        void beforeNavigate().then((allowed) => {
          if (allowed) router.push(String(props.href));
        });
      }}
    />
  );
}
