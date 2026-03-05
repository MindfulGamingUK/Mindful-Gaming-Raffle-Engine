import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const Campaign: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <section className="bg-brand-dark text-white rounded-3xl p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-teal mb-3">Mindful Gaming UK</p>
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">30 Days of Mindful Gaming</h1>
        <p className="text-gray-300 max-w-2xl">
          Daily short-form awareness videos designed to help players and families build healthier gaming habits.
        </p>
      </section>

      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="aspect-video">
              <iframe
                title="30 Days of Mindful Gaming Playlist"
                src="https://www.youtube.com/embed/videoseries?list=PLyy8CTaIwQTkz7j9GjzakmDyH2NIq1ynt"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            This content is educational and awareness-focused. It does not provide medical diagnosis or treatment.
          </p>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-3">Next Steps</h2>
            <p className="text-sm text-gray-600 mb-5">
              Explore current draws or view support resources if you need help with gambling or gaming behaviours.
            </p>
            <div className="space-y-3">
              <Link to="/draws" className="block">
                <Button className="w-full">View Active Draws</Button>
              </Link>
              <Link to="/support" className="block">
                <Button variant="secondary" className="w-full">Support Resources</Button>
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
