import { memoryStore } from "@/lib/repository/memory-store";

export type LabelProfile = {
  id: string;
  name: string;
  format: "ZPL" | "PDF" | "EPL";
  widthIn: number;
  heightIn: number;
  dpi: number;
  printerLanguage: string;
  isDefault?: boolean;
};

export function listLabelProfiles(): LabelProfile[] {
  return (memoryStore.labelProfiles ?? []) as LabelProfile[];
}

export function getDefaultLabelProfile(): LabelProfile {
  const profiles = listLabelProfiles();
  return profiles.find((p) => p.isDefault) ?? profiles[0] ?? {
    id: "lp_fallback",
    name: "Fallback ZPL 4x6",
    format: "ZPL",
    widthIn: 4,
    heightIn: 6,
    dpi: 203,
    printerLanguage: "ZPL II",
    isDefault: true
  };
}

export function getLabelProfile(id?: string | null): LabelProfile {
  if (!id) return getDefaultLabelProfile();
  return listLabelProfiles().find((p) => p.id === id) ?? getDefaultLabelProfile();
}

/** Render thermal-ready label content for the selected profile. */
export function renderThermalLabel(input: {
  profile?: LabelProfile;
  trackingNumber: string;
  fromCity: string;
  toCity: string;
  weightKg: number;
  service?: string;
}): { mimeType: string; body: string; filename: string; format: string } {
  const profile = input.profile ?? getDefaultLabelProfile();
  if (profile.format === "EPL") {
    const epl = [
      "N",
      `A50,50,0,3,1,1,N,"NecoShip ${profile.widthIn}x${profile.heightIn}"`,
      `A50,100,0,3,1,1,N,"${input.trackingNumber}"`,
      `A50,150,0,2,1,1,N,"${input.fromCity} -> ${input.toCity}"`,
      `B50,200,0,1,2,2,80,B,"${input.trackingNumber}"`,
      "P1"
    ].join("\n");
    return {
      mimeType: "application/octet-stream",
      body: epl,
      filename: `${input.trackingNumber}.epl`,
      format: "EPL"
    };
  }

  if (profile.format === "PDF") {
    // Lightweight PDF-like placeholder text; ShipEngine returns real PDF when available.
    const text = `NecoShip ${profile.widthIn}x${profile.heightIn} @ ${profile.dpi}dpi\n${input.trackingNumber}\n${input.fromCity} -> ${input.toCity}\n${input.weightKg}kg ${input.service ?? ""}`;
    return {
      mimeType: "application/pdf",
      body: text,
      filename: `${input.trackingNumber}.pdf`,
      format: "PDF"
    };
  }

  // ZPL — sized for profile
  const zpl = [
    "^XA",
    `^PW${Math.round(profile.widthIn * profile.dpi)}`,
    `^LL${Math.round(profile.heightIn * profile.dpi)}`,
    `^FO40,40^A0N,36,36^FDNecoShip ${profile.widthIn}x${profile.heightIn}^FS`,
    `^FO40,90^A0N,28,28^FD${input.trackingNumber}^FS`,
    `^FO40,140^A0N,22,22^FD${input.fromCity} -> ${input.toCity}^FS`,
    `^FO40,180^A0N,20,20^FDWt ${input.weightKg}kg ${input.service ?? ""}^FS`,
    `^FO40,220^BY2^BCN,80,Y,N,N^FD${input.trackingNumber}^FS`,
    `^FO40,330^A0N,18,18^FD${profile.printerLanguage} ${profile.dpi}dpi^FS`,
    "^XZ"
  ].join("");
  return {
    mimeType: "application/zpl",
    body: zpl,
    filename: `${input.trackingNumber}.zpl`,
    format: "ZPL"
  };
}
