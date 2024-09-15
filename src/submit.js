import React from 'react';
import { useStore } from './store'; // Make sure the path is correct for your store
import axios from 'axios';
import { Button } from '@mui/material';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(state => ({
        nodes: state.nodes,
        edges: state.edges
    }));

    const handleSubmit = async () => {
        try {
            const response = await api.post('/pipelines/parse', { nodes, edges });
            const { num_nodes, num_edges, is_dag } = response.data;
            alert(`Number of nodes: ${num_nodes}\nNumber of edges: ${num_edges}\nIs DAG: ${is_dag}`);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('An error occurred while submitting the pipeline.');
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant="contained" style={{width:"30%", minWidth: "100px", fontWeight:"800", backgroundColor:"#1b2845", fontSize:"16px", letterSpacing:"0.3rem"}} onClick={handleSubmit}>Submit</Button>
        </div>
    );
};
