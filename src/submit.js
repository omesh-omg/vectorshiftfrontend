import React from 'react';
import { useState } from 'react';
import { useStore } from './store'; // Make sure the path is correct for your store
import axios from 'axios';
import edgeIcon from './images/edges.png';
import nodeIcon from './images/nodes.png';
import cyclicIcon from './images/cyclic.png';
import acyclicIcon from './images/acyclic.png';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle ,Box, Typography, Grid , Paper} from '@mui/material';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
});

export const SubmitButton = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { currentFlow ,flows} = useStore(state => ({
        currentFlow: state.currentFlow,
        flows: state.flows
    }));
    const nodes=flows[currentFlow]?.nodes || [];
    const edges=flows[currentFlow]?.edges || [];
    
    const [numEdges, setNumEdges] = useState(null);
    const [numNodes, setNumNodes] = useState(null);
    const [isDag, setIsDag] = useState(null);
    const [dagIcon,setDagIcon] = useState(null);
    // let dagIcon;
    // dagIcon=acyclicIcon;
    const handleSubmit = async () => {
        try {
            const response = await api.post('/pipelines/parse', { nodes, edges });
            let { num_nodes, num_edges, is_dag } = response.data;
            setNumEdges(num_edges);
            setNumNodes(num_nodes);
            setIsDag (is_dag);
            // if(isDag)
            setDagIcon( isDag?acyclicIcon:cyclicIcon);
            // alert(`Number of nodes: ${num_nodes}\nNumber of edges: ${num_edges}\nIs DAG: ${is_dag}`);
            setDialogOpen(true);

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('An error occurred while submitting the pipeline.');
        }
    };

    return (
        <>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant="contained" style={{width:"30%", minWidth: "100px", fontWeight:"800", backgroundColor:"#1b2845", fontSize:"16px", letterSpacing:"0.3rem"}} onClick={handleSubmit}>Submit</Button>
        </div>
        <Dialog open={dialogOpen} onClose={()=>{setDialogOpen(false)}}>
        <DialogTitle sx={{letterSpacing:".1rem"}}>RESPONSE FROM THE API</DialogTitle>
        <DialogContent>
          

        <Box sx={{ padding: 5 ,display:'flex', flexDirection:'row'}}>
          <Paper elevation={3} sx={{ minWidth:"100px", minHeight:"180px",padding: 2, margin:2, textAlign: 'center',height:"90%"  }}>
            <img src={nodeIcon} alt="Nodes" style={{ width: '50px' }} />
            <Typography variant="h6">Number of Nodes</Typography>
            <Typography variant="h4">{numNodes}</Typography>
          </Paper>
          <Paper elevation={3} sx={{ minWidth:"100px", minHeight:"180px",padding: 2, margin:2, textAlign: 'center' ,height:"90%"}}>
            <img src={edgeIcon} alt="Edges" style={{ width: '50px' }} />
            <Typography variant="h6">Number of Edges</Typography>
            <Typography variant="h4">{numEdges}</Typography>
          </Paper>
          <Paper elevation={3} sx={{  minWidth:"100px", minHeight:"180px",padding: 2, margin:2, textAlign: 'center',height:"90%",justifyContent:"space-acround" }}>
            <img src={dagIcon} alt={isDag ? 'Acyclic' : 'Cyclic'} style={{ width: '50px' }} />
            <Typography variant="h6">Is DAG?</Typography>
            <Typography style={{visibility:"hidden"}}variant="h6">(DAG )</Typography>
            <Typography variant="h4">{isDag ? 'Yes' : 'No'}</Typography>
          </Paper>
    </Box>


        </DialogContent>
        
          <Button variant= "contained" style={{borderRadius:"0", letterSpacing:".1rem",fontWeight:"800", backgroundColor:"#1b2845"}} onClick={()=>{setDialogOpen(false)}}>OKAY</Button>
        
      </Dialog>
        </>
    );
};
