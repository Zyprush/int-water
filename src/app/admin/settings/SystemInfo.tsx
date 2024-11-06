"use client";
import React from "react";
import TextSetting from "./TextSetting";

const SystemInfo = () => {
  return (
    <div className="mt-2 flex flex-col items-start  justify-start p-8 border-t border-gray-200 bg-opacity-35 bg-zinc-200 dark:bg-gray-800 dark:border-gray-600">
      <TextSetting name="systemName" title="System Name" />
      <TextSetting name="mission" title="Mission" />
      <TextSetting name="address" title="Address" />
      <TextSetting name="contact" title="Contact" />
      <p>Person authorized to recommend approval for installation</p>
      <TextSetting name="authorizedName" title="Name" />
      <TextSetting name="authorizedPosition" title="Position" />
      <p>Person authorized to approve the installation</p>
      <TextSetting name="authorizedName2" title="Name" />
      <TextSetting name="authorizedPosition2" title="Position" />
    </div>
  );
};

export default SystemInfo;
