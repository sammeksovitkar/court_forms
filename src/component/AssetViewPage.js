import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Landmark, User, Package } from 'lucide-react';

const AssetViewPage = () => {
    const { id } = useParams();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
const api= process.env.REACT_APP_BACKEND_URL
useEffect(() => {
    // DO NOT USE localhost here. Use the computer's IP.
    axios.get(api+`/api/assets/${id}`)
        .then(res => setAsset(res.data))
        .catch((err) => {
            console.error("Connection to backend failed", err);
            setAsset(null);
        })
        .finally(() => setLoading(false));
}, [id]);

    if (loading) return <div className="p-20 text-center font-bold">लोड होत आहे...</div>;
    if (!asset) return <div className="p-20 text-center text-red-500 font-bold">माहिती सापडली नाही!</div>;

    return (
        <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-indigo-700 p-6 text-white text-center">
                    <ShieldCheck size={48} className="mx-auto mb-2 text-teal-400" />
                    <h1 className="text-xl font-bold">मुद्देमाल माहिती</h1>
                    <p className="text-xs">ID: {asset.gmrVmrNo}</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between border-b pb-2 text-sm">
                        <span className="text-slate-500">केस क्रमांक:</span>
                        <span className="font-bold">{asset.caseNo}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 text-sm">
                        <span className="text-slate-500">फिर्यादी:</span>
                        <span className="font-bold">{asset.firyadicheName}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded text-sm">
                        <p className="text-slate-400 font-bold uppercase text-[10px]">वर्णन</p>
                        <p className="text-slate-700 italic">"{asset.varnan}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetViewPage;