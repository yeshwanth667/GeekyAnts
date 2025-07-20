// src/components/SkillTags.tsx
export default function SkillTags({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill, idx) => (
        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
          {skill}
        </span>
      ))}
    </div>
  );
}
