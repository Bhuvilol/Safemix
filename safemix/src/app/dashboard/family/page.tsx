"use client";
import { useState } from "react";
import { Users, Plus, MoreHorizontal, Heart, Shield, Activity, UserPlus } from "lucide-react";

const family = [
  { name: "Rahul Sharma", role: "Self (Patient)", meds: 4, health: "1 Alert", avatar: "R", color: "#5E7464" },
  { name: "Suman Sharma", role: "Mother", meds: 6, health: "Safe", avatar: "S", color: "#3B82F6" },
  { name: "Amit Sharma", role: "Father", meds: 8, health: "2 Alerts", avatar: "A", color: "#8B5CF6" },
  { name: "Priya Sharma", role: "Spouse", meds: 2, health: "Safe", avatar: "P", color: "#EC4899" },
];

export default function FamilyProfilesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-bold text-2xl text-[#1a2820]">Family Profiles</h1>
          <p className="text-sm text-[#7a9080] mt-1">Manage and monitor medication safety for your entire household.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#42594A] text-white rounded-2xl text-sm font-semibold shadow-md hover:shadow-xl transition-all w-full md:w-auto justify-center">
          <UserPlus className="w-4 h-4" />
          Add Family Profile
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {family.map((member) => (
          <div key={member.name} className="bg-white rounded-3xl border border-[#e0e8e2] p-6 flex flex-col items-center text-center group hover:border-[#5E7464]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#F8F8F4] rounded-bl-[40px] -translate-y-1 -translate-x-1 border-b border-l border-[#e0e8e2] flex items-center justify-center">
              <button className="text-[#9ab0a0] hover:text-[#52615a]"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="w-20 h-20 rounded-[30px] flex items-center justify-center text-2xl font-bold font-manrope text-white mb-4 shadow-lg group-hover:scale-105 transition-transform" style={{ background: member.color }}>
              {member.avatar}
            </div>
            
            <h3 className="font-manrope font-bold text-lg text-[#1a2820]">{member.name}</h3>
            <p className="text-xs font-semibold text-[#9ab0a0] uppercase tracking-widest mt-1">{member.role}</p>

            <div className="w-full h-px bg-[#f0f4f1] my-6" />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-tighter">Medicines</p>
                <p className="text-sm font-bold text-[#1a2820] mt-1">{member.meds}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9ab0a0] uppercase tracking-tighter">Health Status</p>
                <p className={`text-sm font-bold mt-1 ${member.health === "Safe" ? "text-emerald-600" : "text-red-600"}`}>
                  {member.health}
                </p>
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-2xl bg-[#F8F8F4] border border-[#e0e8e2] text-xs font-bold text-[#52615a] hover:bg-[#42594A] hover:text-white hover:border-[#42594A] transition-all">
              Switch to Profile
            </button>
          </div>
        ))}

        {/* Add Card */}
        <button className="border-2 border-dashed border-[#c3d4c8] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-[#9ab0a0] hover:border-[#5E7464] hover:text-[#5E7464] hover:bg-[#F8F8F4] transition-all">
          <div className="w-16 h-16 rounded-full bg-[#f0f5f1] flex items-center justify-center">
            <Plus className="w-8 h-8" />
          </div>
          <p className="font-bold text-sm">Add New Profile</p>
        </button>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 pt-6">
        {[
          { icon: Shield, title: "Caregiver Privacy", desc: "Set granular permissions for what each family member can see." },
          { icon: Heart, title: "Shared Reminders", desc: "Get notified when a dependent misses their medication dose." },
          { icon: Activity, title: "Combined Reports", desc: "View a consolidated safety report for your whole household." },
        ].map((f) => (
          <div key={f.title} className="p-6 rounded-3xl bg-white border border-[#e0e8e2] flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#5E7464]/10 flex items-center justify-center flex-shrink-0">
              <f.icon className="w-5 h-5 text-[#5E7464]" />
            </div>
            <div>
              <h4 className="font-manrope font-bold text-[#1a2820] text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-[#7a9080] leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
