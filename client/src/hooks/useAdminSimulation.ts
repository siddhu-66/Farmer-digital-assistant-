import { useState, useEffect } from 'react';
export function useAdminSimulation() {
  const [farmers, setFarmers] = useState(1240);
const [pending, setPending] = useState(15);
const [queue, setQueue] = useState([ { name: 'Kiran Devi', region: 'Bihar', doc: 'Land Records', status: 'Pending' }, { name: 'Rajesh Kumar', region: 'Haryana', doc: 'Aadhar Card', status: 'In Review' }, ]); useEffect(() => {
  const interval = setInterval(() => {
  // Simulate random new farmer registrations
if (Math.random() > 0.7) { setFarmers(f => f + 1); }
// Simulate verification queue
if (Math.random() > 0.8) {
  const names = ['Amit Patel', 'Suresh Ray', 'Anita Devi', 'Pooja Sharma'];
const regions = ['Gujarat', 'UP', 'MP', 'Rajasthan'];
const docs = ['Bank Details', 'Aadhar Card', 'Land Records'];
const newReq = { name: names[Math.floor(Math.random() * names.length)], region: regions[Math.floor(Math.random() * regions.length)], doc: docs[Math.floor(Math.random() * docs.length)], status: 'Pending' }; setQueue(q => [newReq, ...q.slice(0, 4)]); setPending(p => p + 1); } }, 5000);
return () => clearInterval(interval); }, []);
return { farmers, pending, queue };
}
