'use client';

import React, { useEffect, useState } from 'react';
import { CreateNodeDto } from '../../types';

interface NodeRegistrationFormProps {
  onSubmit: (data: CreateNodeDto) => void;
  ownerId: string;
}

function getGpuModel(): string | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
  } catch (err) {
    console.warn('WebGL GPU detection failed:', err);
  }
  return null;
}

function getLocalIP(): Promise<string | null> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => resolve(null));

    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) return;

      const candidate = event.candidate.candidate;
      const match = candidate.match(/(\d{1,3}(\.\d{1,3}){3})/); // IPv4
      if (match) {
        resolve(match[1]);
        pc.close();
      }
    };

    setTimeout(() => resolve(null), 2000); // fallback if failed
  });
}

export const NodeRegistrationForm: React.FC<NodeRegistrationFormProps> = ({ onSubmit, ownerId }) => {
  const [gpuModel, setGpuModel] = useState('');
  const [nodeUrl, setNodeUrl] = useState('');
  const [totalMemoryMb, setTotalMemoryMb] = useState('');

  useEffect(() => {
    const init = async () => {
      const detectedGpu = getGpuModel();
      if (detectedGpu) setGpuModel(detectedGpu);

      const ip = await getLocalIP();
      const defaultPort = 5000;
      if (ip) {
        setNodeUrl(`http://${ip}:${defaultPort}`);
      }

      // Estimate: fallback total memory (user can edit)
      if (!totalMemoryMb) {
        setTotalMemoryMb('8192'); // Default 8GB as placeholder
      }
    };
    init();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      gpuModel,
      nodeUrl,
      totalMemoryMb: parseInt(totalMemoryMb, 10),
      ownerId,
    });
    setGpuModel('');
    setNodeUrl('');
    setTotalMemoryMb('');
  };

  return (
    <div className="registration-form">
      <h2>Register Your GPU Node</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>GPU Model:</label>
          <input
            type="text"
            value={gpuModel}
            onChange={(e) => setGpuModel(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Node URL (Coordinator will reach this):</label>
          <input
            type="text"
            value={nodeUrl}
            onChange={(e) => setNodeUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total GPU Memory (MB):</label>
          <input
            type="number"
            value={totalMemoryMb}
            onChange={(e) => setTotalMemoryMb(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};