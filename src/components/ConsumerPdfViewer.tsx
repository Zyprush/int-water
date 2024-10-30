'use client';

import React, { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Consumer } from '@/components/adminAccount/types';

// Define coordinates for each consumer field in the PDF
const FIELD_COORDINATES = {
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

interface ConsumerPDFViewerProps {
    isOpen: boolean;
    onClose: () => void;
    consumer: Consumer | null;
}

export default function ConsumerPDFViewer({ isOpen, onClose, consumer }: ConsumerPDFViewerProps) {
    const [modifiedPdfUrl, setModifiedPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && consumer) {
            modifyPdf();
        }
    }, [isOpen, consumer]); // Keep consumer here to trigger on changes


    const modifyPdf = async () => {
        if (!consumer) return;

        setIsLoading(true);
        try {
            // Load the existing PDF from the public folder
            const existingPdfBytes = await fetch('/pdf/water-connection-form.pdf').then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            // Get the first page
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            // Get page dimensions
            const { height } = firstPage.getSize();

            // Embed font
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Draw all fields except serviceConnectionType and serviceConnectionSize
            Object.entries(consumer).forEach(([field, value]) => {
                const coordinates = FIELD_COORDINATES[field as keyof typeof FIELD_COORDINATES];
                if (coordinates && field !== 'serviceConnectionType' && field !== 'serviceConnectionSize') {
                    let displayValue = value
                        ? typeof value === 'number'
                            ? value.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2 })
                            : String(value)
                        : ``;

                    if (field === 'currentAddress' && typeof displayValue === 'string' && displayValue.includes(',')) {
                        displayValue = displayValue.slice(0, displayValue.indexOf(','));
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
                    case 'residential':
                        checkCoordinates = { x: 79, y: 230 };
                        break;
                    case 'commercial':
                        checkCoordinates = { x: 79, y: 252 };
                        break;
                    case 'institutional':
                        checkCoordinates = { x: 180, y: 230 };
                        break;
                    case 'special':
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
                    case '1/2 inch':
                        checkCoordinates = { x: 79, y: 300 };
                        break;
                    case '3/4 inch':
                        checkCoordinates = { x: 79, y: 319 };
                        break;
                    case '1 inch':
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
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            setModifiedPdfUrl(url);
        } catch (error) {
            console.error('Error modifying PDF:', error);
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
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-72 bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
