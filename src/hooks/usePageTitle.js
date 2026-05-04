import { useEffect } from "react";

const BASE_TITLE = "Route Posts";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} — Connect, Share & Discover`;
    return () => {
      document.title = `${BASE_TITLE} — Connect, Share & Discover`;
    };
  }, [title]);
}
