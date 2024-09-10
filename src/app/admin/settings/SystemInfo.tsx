"use client";
import React from "react";
import TextSetting from "./TextSetting";

const SystemInfo = () => {
  return (
    <div className="mt-2 flex items-start  justify-start gap-5 p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200 dark:bg-gray-800 dark:border-gray-600">
      <TextSetting name="systemName" title="System Name" />
      <TextSetting name="mission" title="Mission" />
      <TextSetting name="address" title="Address" />
      <TextSetting name="contact" title="Contact" />
    </div>
  );
};

export default SystemInfo;
