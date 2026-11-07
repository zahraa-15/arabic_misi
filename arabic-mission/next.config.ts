import type { NextConfig } from "next";

const config: NextConfig = {
  // Do not use output: "export". Arabic Mission now needs server API routes
  // for secure login sessions and the Apps Script database connection.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
