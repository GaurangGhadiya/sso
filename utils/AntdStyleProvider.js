"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { AntdProvider } from "./AntdStyledComponentsRegistry";

export function AntdStyleProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1976d2",
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 8,
          },
        }}
      >
        <AntdProvider>{children}</AntdProvider>
      </ConfigProvider>
    </ConfigProvider>
  );
}
