import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const uploadDataset = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/pipeline/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload Error", error);
        return null;
    }
};

import { MockDataPoint, PipelineResponse } from '../types';

export const runPipeline = async (data?: MockDataPoint[], data_id?: string): Promise<PipelineResponse | null> => {
    try {
        const payload = {
            task_type: "full_suite",
            target_column: "target" // Hardcoded for demo, normally dynamic
        } as {
            task_type: string;
            target_column: string;
            data_id?: string;
            data?: MockDataPoint[];
        };

        if (data_id) {
            payload.data_id = data_id;
        } else if (data) {
            payload.data = data;
        } else {
            throw new Error("No data provided");
        }

        const response = await axios.post(`${API_URL}/pipeline/run`, payload, {
            timeout: 5000 // 5 second strict timeout
        });
        return response.data;
    } catch (error) {
        console.error("Pipeline Error", error);
        return null;
    }
};
