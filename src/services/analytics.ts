import { VISITOR_KEY } from "@/lib/globals";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function getEscalationRate() {
  const [totalSessions, escalatedSessions] = await Promise.all([
    prisma.chatSession.count(),
    prisma.chatSession.count({
      where: {
        escalated: true,
      },
    }),
  ]);

  const rate =
    totalSessions === 0
      ? 0
      : (escalatedSessions / totalSessions) * 100;

  return {
    total_sessions: totalSessions,
    lead_escalated_sessions: escalatedSessions,
    lead_escalation_rate: Number(rate.toFixed(2)),
  };
}

export async function getEngagementRate() {
  const [visitorCount, chatSessions] = await Promise.all([
    redis.get(VISITOR_KEY),
    prisma.chatSession.count(),
  ]);

  const visitors = parseInt(visitorCount ?? "0", 10);

  const rate =
    visitors === 0
      ? 0
      : (chatSessions / visitors) * 100;

  return {
    total_visitors: visitors,
    total_sessions: chatSessions,
    engagement_rate: Number(rate.toFixed(2)),
  };
}

export async function getLeadCaptureRate() {
  const [totalSessions, leadCapturedSessions] = await Promise.all([
    prisma.chatSession.count(),
    prisma.chatSession.count({
      where: {
        lead_captured: true,
      },
    }),
  ]);

  const rate =
    totalSessions === 0
      ? 0
      : (leadCapturedSessions / totalSessions) * 100;

  return {
    total_sessions: totalSessions,
    lead_captured_sessions: leadCapturedSessions,
    lead_capture_rate: Number(rate.toFixed(2)),
  };
}

export async function getLeadQualificationRate() {
  const [totalLeads, qualifiedLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: {
        qualified: true,
      },
    }),
  ]);

  const rate =
    totalLeads === 0
      ? 0
      : (qualifiedLeads / totalLeads) * 100;

  return {
    total_leads: totalLeads,
    qualified_leads: qualifiedLeads,
    rate: Number(rate.toFixed(2)),
  };
}