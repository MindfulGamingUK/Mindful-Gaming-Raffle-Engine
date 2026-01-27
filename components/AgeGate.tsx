import React from 'react';

interface AgeGateProps {
  dob: string;
  onDobChange: (dob: string) => void;
  onVerified: (isOver18: boolean) => void;
}

export const AgeGate: React.FC<AgeGateProps> = ({ dob, onDobChange, onVerified }) => {
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    onDobChange(newDob);
    const age = calculateAge(newDob);
    onVerified(age >= 18);
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2">Age Verification Required</h3>
      <p className="text-sm text-yellow-700 mb-3">
        You must be 18 or over to purchase a raffle ticket. This is a legal requirement.
      </p>
      <div className="flex flex-col space-y-2">
        <label htmlFor="dob" className="text-xs font-semibold text-gray-600">Date of Birth</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={handleDateChange}
          className="p-2 border rounded-md focus:ring-2 focus:ring-brand-purple focus:outline-none"
        />
      </div>
    </div>
  );
};
