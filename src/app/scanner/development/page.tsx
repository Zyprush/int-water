"use client";

import WaterConsumptionResult from "@/components/Result";
import { useState } from "react";


const Development: React.FC = () => {
    const [recognizedText] = useState<string | null>(null);

    
    return (
        <div>
            <WaterConsumptionResult recognizedText={recognizedText} />
        </div>
    );
};

export default Development;