import MemberClient from "./client";

// Team member data
const teamMembersData: Record<number, any> = {
  1: {
    id: 1,
    name: "Aromal V G",
    phone: "+918281783052",
    email: "aromalvijayan448@gmail.com",
    avatar: "/team-dashboard/aromal.jpg",
    role: "SEO Specialist",
    joinedDate: "2026-02-26",
    tasks: [
      {
        id: 1,
        title: "SEO - Product Solutions",
        deadline: "March 1, 2026",
        daysRemaining: 3,
        priority: "High",
        status: "In Progress",
        progress: 25,
        description: "Optimize product pages for search engines",
      },
    ],
    checkIns: {
      morning: { time: "9:00 AM", status: false },
      afternoon: { time: "2:00 PM", status: false },
      evening: { time: "7:00 PM", status: false },
    },
    activityLog: [
      { timestamp: "2026-02-27T19:30:00+05:30", event: "Profile updated with photo and email", type: "update" },
      { timestamp: "2026-02-26T23:30:00+05:30", event: "Dashboard link sent", type: "update" },
      { timestamp: "2026-02-26T12:14:00+05:30", event: "Task assigned: SEO - Product Solutions", type: "task" },
      { timestamp: "2026-02-26T12:10:00+05:30", event: "Added to team", type: "member" },
    ],
    stats: {
      totalTasks: 1,
      completedTasks: 0,
      inProgress: 1,
      efficiency: 0,
    },
  },
  2: {
    id: 2,
    name: "Adarsh B S",
    phone: "+919400355185",
    email: "adarshsarachandran@gmail.com",
    avatar: null,
    role: "Manager",
    joinedDate: "2026-01-01",
    tasks: [
      {
        id: 1,
        title: "Team Management",
        deadline: "Ongoing",
        daysRemaining: 0,
        priority: "High",
        status: "Active",
        progress: 100,
        description: "Manage team members and track progress",
      },
    ],
    checkIns: {
      morning: { time: "9:00 AM", status: true },
      afternoon: { time: "2:00 PM", status: true },
      evening: { time: "7:00 PM", status: true },
    },
    activityLog: [
      { timestamp: "2026-02-27T19:35:00+05:30", event: "Added to team dashboard", type: "member" },
      { timestamp: "2026-02-26T12:00:00+05:30", event: "Team management system created", type: "system" },
    ],
    stats: {
      totalTasks: 5,
      completedTasks: 12,
      inProgress: 1,
      efficiency: 95,
    },
  },
};

// Required for static export with dynamic routes
export function generateStaticParams() {
  return Object.keys(teamMembersData).map((id) => ({
    id: id.toString(),
  }));
}

export default function MemberPage({ params }: { params: { id: string } }) {
  const memberId = parseInt(params.id);
  const member = teamMembersData[memberId];
  
  if (!member) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <p>Member not found</p>
        <a href="/team-dashboard/team" className="text-blue-400 hover:underline">Back to Team</a>
      </div>
    );
  }
  
  return <MemberClient member={member} />;
}
