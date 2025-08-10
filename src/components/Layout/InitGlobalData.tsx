"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { usePathname } from "next/navigation";

import { getToken } from "@/core/helper/storage";
import { profileState } from "@/core/recoil/state";
import { getProfile } from "@/core/api/auth.api";

const excludePath = ["/auth/login"];

export function InitGlobalData() {
  const pathname = usePathname();
  const [, setProfileState] = useRecoilState(profileState);
  const token = getToken();
  const enabled = !!token && !excludePath.includes(pathname);

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["PROFILE", token],
    queryFn: () => getProfile(),
    enabled,
  });

  useEffect(() => {
    if (isLoading) {
      setProfileState((prevState: any) => ({
        ...prevState,
      }));
    } else {
      setProfileState({
        data: profile || null,
        refetch,
      });
    }
  }, [isLoading, profile, setProfileState]);

  return <></>;
}
