"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { usePathname } from "next/navigation";

import { getToken } from "@/core/helper/storage";
import { profileState } from "@/core/recoil/state";
import { getProfile } from "@/core/api/auth.service";

const excludePath = ["/auth/login"];

export function InitGlobalData() {
  const pathname = usePathname();
  const [, setProfileState] = useRecoilState(profileState);
  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery(["PROFILE", getToken()], () => getProfile(), {
    enabled: !!getToken() && !excludePath.includes(pathname),
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
