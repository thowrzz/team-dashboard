import MemberClient from "./client";

// Team member data
const teamMembers = [
  { id: 1, name: "Aromal V G", phone: "+918281783052" },
  { id: 2, name: "Adarsh B S", phone: "+919400355185" },
];

// Required for static export with dynamic routes
export function generateStaticParams() {
  return teamMembers.map((member) => ({
    id: member.id.toString(),
  }));
}

export default function MemberPage({ params }: { params: { id: string } }) {
  return <MemberClient memberId={parseInt(params.id)} />;
}
