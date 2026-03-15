import React from 'react';

interface TabProps {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
    icon?: string;
}

const Tab: React.FC<TabProps> = ({ label, count, active, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold transition-all whitespace-nowrap ${active
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
            }`}
    >
        {icon && <span className="text-xl">{icon}</span>}
        {label}
        {count !== undefined && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
            </span>
        )}
    </button>
);

interface DrawTabsProps {
    activeTab: 'SURVEY' | 'LOTTERY' | 'COMPETITION';
    onTabChange: (tab: 'SURVEY' | 'LOTTERY' | 'COMPETITION') => void;
    counts: { lottery: number, competition: number };
}

export const DrawTabs: React.FC<DrawTabsProps> = ({ activeTab, onTabChange, counts }) => {
    return (
        <div className="flex overflow-x-auto border-b border-gray-100 no-scrollbar">
            <Tab
                label="Survey (60s)"
                icon="📋"
                active={activeTab === 'SURVEY'}
                onClick={() => onTabChange('SURVEY')}
            />
            <Tab
                label="Prize Draws"
                icon="🎰"
                count={counts.lottery}
                active={activeTab === 'LOTTERY'}
                onClick={() => onTabChange('LOTTERY')}
            />
            <Tab
                label="Prize Competitions"
                icon="🧠"
                count={counts.competition}
                active={activeTab === 'COMPETITION'}
                onClick={() => onTabChange('COMPETITION')}
            />
        </div>
    );
};
