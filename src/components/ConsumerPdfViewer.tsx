"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Consumer } from "@/components/adminAccount/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

// Define coordinates for each consumer field in the PDF
const FIELD_COORDINATES = {
  address: { x: 155, y: 69 },
  systemName: { x: 191, y: 80 },
  autorizedName: { x: 120, y: 685 },
  authorizedPosition: { x: 95, y: 700 },
  authorizedName2: { x: 355, y: 685 },
  authorizedPosition2: { x: 375, y: 700 },

  applicantName: { x: 135, y: 163 },
  cellphoneNo: { x: 350, y: 163 },
  currentAddress: { x: 168, y: 175 },
  installationAddress: { x: 240, y: 189 },
  // next
  //email: { x: 150, y: 290 },
  serviceConnectionType: { x: 79, y: 230 },

  serviceConnectionSize: { x: 150, y: 350 },

  buildingOwnerName: { x: 350, y: 245 },
  buildingOwnerAddress: { x: 350, y: 285 },
  buildingOwnerCellphone: { x: 350, y: 325 },

  //rate: { x: 150, y: 470 },
  installationFee: { x: 200, y: 577 },
  meterDeposit: { x: 200, y: 590 },
  guarantyDeposit: { x: 200, y: 603 },
  totalAmountDue: { x: 200, y: 616 },
  paidUnderOR: { x: 75, y: 640 },
  serviceConnectionNo: { x: 415, y: 577 },
  customerAccountNo: { x: 415, y: 590 },
  waterMeterSerialNo: { x: 415, y: 603 },
  waterMeterBrand: { x: 415, y: 616 },
  waterMeterSize: { x: 415, y: 629 },
  initialReading: { x: 415, y: 642 },
} as const;
const dates = new Date();

const dateToday = dates.toLocaleDateString();

// Get date (day of the month)
const date = dates.getDate();

// Get month name
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const month = monthNames[dates.getMonth()];

// Get year
const year = dates.getFullYear();

const FIELD_COORDINATES_2 = {
  authorizedName: { x: 338, y: 608 },
  authorizedPosition: { x: 338, y: 616 },
  authorizedName2: { x: 400, y: 72 },
  authorizedPosition2: { x: 75, y: 83 },
  applicantName: { x: 75, y: 93 },
  currentAddress: { x: 318, y: 93 },
  currentDate: { x: 293, y: 72 },
  address: { x: 110, y: 636 },
} as const;

interface ConsumerPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  consumer: Consumer | null;
}
interface Settings {
  systemName: string;
  address: string;
  authorizedName: string;
  authorizedName2: string;
  authorizedPosition: string;
  authorizedPosition2: string;
}

export default function ConsumerPDFViewer({
  isOpen,
  onClose,
  consumer,
}: ConsumerPDFViewerProps) {
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (isOpen && consumer) {
      modifyPdf();
    }
  }, [isOpen, consumer, settings]); // Keep consumer here to trigger on changes

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch systemName document
        const systemNameDoc = await getDoc(doc(db, "settings", "systemName"));
        // Fetch address document
        const addressDoc = await getDoc(doc(db, "settings", "address"));

        const autorizedNameDoc = await getDoc(
          doc(db, "settings", "authorizedName")
        );

        const authorizedName2Doc = await getDoc(
          doc(db, "settings", "authorizedName2")
        );

        const authorizedPositionDoc = await getDoc(
          doc(db, "settings", "authorizedPosition")
        );

        const authorizedPosition2Doc = await getDoc(
          doc(db, "settings", "authorizedPosition2")
        );

        setSettings({
          systemName: systemNameDoc.exists() ? systemNameDoc.data().value : "",
          address: addressDoc.exists() ? addressDoc.data().value : "",
          authorizedName: autorizedNameDoc.exists()
            ? autorizedNameDoc.data().value
            : "",
          authorizedName2: authorizedName2Doc.exists()
            ? authorizedName2Doc.data().value
            : "",
          authorizedPosition: authorizedPositionDoc.exists()
            ? authorizedPositionDoc.data().value
            : "",
          authorizedPosition2: authorizedPosition2Doc.exists()
            ? authorizedPosition2Doc.data().value
            : "",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const modifyPdf = async () => {
    if (!consumer || !settings) return;

    setIsLoading(true);
    try {
      // Load the existing PDF from the public folder
      const existingPdfBytes = await fetch("/pdf/connection-form-contract.pdf").then(
        (res) => res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const secondPage = pages[1];

      // Get page dimensions
      const { height } = firstPage.getSize();

      // Embed font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      secondPage.drawText(settings.authorizedName.toUpperCase(), {
        x: FIELD_COORDINATES_2.authorizedName.x,
        y: height - FIELD_COORDINATES_2.authorizedName.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(consumer.currentAddress + ".", {
        x: FIELD_COORDINATES_2.currentAddress.x,
        y: height - FIELD_COORDINATES_2.currentAddress.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      {
        /*
                
                secondPage.drawText(settings.address, {
                    x: 385,
                    y: height - FIELD_COORDINATES_2.currentAddress.y,
                    size: 8,
                    font,
                    color: rgb(0, 0, 0),
                });
        */
      }

      secondPage.drawText(settings.address, {
        x: 250,
        y: height - 135,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(consumer.applicantName, {
        x: FIELD_COORDINATES_2.applicantName.x,
        y: height - 608,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.authorizedPosition, {
        x: FIELD_COORDINATES_2.authorizedPosition.x,
        y: height - FIELD_COORDINATES_2.authorizedPosition.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.authorizedName2 + ",", {
        x: FIELD_COORDINATES_2.authorizedName2.x,
        y: height - FIELD_COORDINATES_2.authorizedName2.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.authorizedPosition2, {
        x: FIELD_COORDINATES_2.authorizedPosition2.x,
        y: height - FIELD_COORDINATES_2.authorizedPosition2.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(consumer.applicantName, {
        x: FIELD_COORDINATES_2.applicantName.x,
        y: height - FIELD_COORDINATES_2.applicantName.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(month + "", {
        x: 286,
        y: height - 72,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(year + "", {
        x: 329,
        y: height - 72,
        size: 7.5,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(date + "", {
        x: 264,
        y: height - 72,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(month + " " + date + ", " + year, {
        x: 110,
        y: height - 646,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(month + " " + date + ", " + year, {
        x: 370,
        y: height - 646,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.address, {
        x: 370,
        y: height - FIELD_COORDINATES_2.address.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.address, {
        x: FIELD_COORDINATES_2.address.x,
        y: height - FIELD_COORDINATES_2.address.y,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(date + "", {
        x: 464,
        y: height - 720,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });
      secondPage.drawText(month + "", {
        x: 76,
        y: height - 730,
        size: 8,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText("" + year, {
        x: 116,
        y: height - 730,
        size: 7.5,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.address, {
        x: 144,
        y: height - 730,
        size: 7.5,
        font,
        color: rgb(0, 0, 0),
      });

      secondPage.drawText(settings.authorizedName2, {
        x: 250,
        y: height - 763,
        size: 7.5,
        font,
        color: rgb(0, 0, 0),
      });
      secondPage.drawText(settings.authorizedPosition2, {
        x: 265,
        y: height - 770,
        size: 7.5,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw settings headers
      firstPage.drawText(settings.systemName, {
        x: FIELD_COORDINATES.systemName.x,
        y: height - FIELD_COORDINATES.systemName.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(dateToday, {
        x: 255,
        y: height -447.5,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(dateToday, {
        x: 460,
        y: height - 434,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(dateToday, {
        x: 137,
        y: height - 640,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(settings.address, {
        x: FIELD_COORDINATES.address.x,
        y: height - FIELD_COORDINATES.address.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(settings.authorizedName, {
        x: FIELD_COORDINATES.autorizedName.x,
        y: height - FIELD_COORDINATES.autorizedName.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(settings.authorizedName2, {
        x: FIELD_COORDINATES.authorizedName2.x,
        y: height - FIELD_COORDINATES.authorizedName2.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(settings.authorizedPosition, {
        x: FIELD_COORDINATES.authorizedPosition.x,
        y: height - FIELD_COORDINATES.authorizedPosition.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      firstPage.drawText(settings.authorizedPosition2, {
        x: FIELD_COORDINATES.authorizedPosition2.x,
        y: height - FIELD_COORDINATES.authorizedPosition2.y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw all fields except serviceConnectionType and serviceConnectionSize
      Object.entries(consumer).forEach(([field, value]) => {
        const coordinates =
          FIELD_COORDINATES[field as keyof typeof FIELD_COORDINATES];
        if (
          coordinates &&
          field !== "serviceConnectionType" &&
          field !== "serviceConnectionSize"
        ) {
          let displayValue = value
            ? typeof value === "number"
              ? value.toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                })
              : String(value)
            : ``;

          if (
            field === "currentAddress" &&
            typeof displayValue === "string" &&
            displayValue.includes(",")
          ) {
            displayValue = displayValue.slice(0, displayValue.indexOf(","));
          }

          firstPage.drawText(displayValue, {
            x: coordinates.x,
            y: height - coordinates.y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
        }
      });

      // Conditional logic for serviceConnectionType checkmark
      if (consumer.serviceConnectionType) {
        const checkmark = "/";
        let checkCoordinates;

        switch (consumer.serviceConnectionType) {
          case "residential":
            checkCoordinates = { x: 79, y: 230 };
            break;
          case "commercial":
            checkCoordinates = { x: 79, y: 252 };
            break;
          case "institutional":
            checkCoordinates = { x: 180, y: 230 };
            break;
          case "special":
            checkCoordinates = { x: 180, y: 252 };
            break;
        }

        if (checkCoordinates) {
          firstPage.drawText(checkmark, {
            x: checkCoordinates.x,
            y: height - checkCoordinates.y,
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }

      // Conditional logic for serviceConnectionSize checkmark
      if (consumer.serviceConnectionSize) {
        const checkmark = "/";
        let checkCoordinates;

        switch (consumer.serviceConnectionSize) {
          case "1/2 inch":
            checkCoordinates = { x: 79, y: 300 };
            break;
          case "3/4 inch":
            checkCoordinates = { x: 79, y: 319 };
            break;
          case "1 inch":
            checkCoordinates = { x: 180, y: 300 };
            break;
          default:
            checkCoordinates = { x: 180, y: 319 };
            break;
        }

        if (checkCoordinates) {
          firstPage.drawText(checkmark, {
            x: checkCoordinates.x,
            y: height - checkCoordinates.y,
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();

      // Create URL for preview
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setModifiedPdfUrl(url);
    } catch (error) {
      console.error("Error modifying PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (modifiedPdfUrl) {
        URL.revokeObjectURL(modifiedPdfUrl);
        setModifiedPdfUrl(null);
      }
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-72 bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="bg-white rounded-lg w-1/2 h-screen relative flex flex-col">
        <div className="flex-grow relative border border-gray-300 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : modifiedPdfUrl ? (
            <iframe
              src={modifiedPdfUrl}
              className="w-full h-full"
              title="Modified PDF"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
