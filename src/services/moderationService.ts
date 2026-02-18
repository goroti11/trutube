import { supabase } from '../lib/supabase';

export interface ContentReport {
  id: string;
  content_type: 'video' | 'comment' | 'profile';
  content_id: string;
  reporter_id: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'copyright' | 'inappropriate' | 'other';
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  reporter_trust_at_time: number;
  created_at: string;
}

export interface ModerationVote {
  id: string;
  report_id: string;
  voter_id: string;
  vote: 'remove' | 'keep' | 'warn';
  comment: string;
  voter_trust_at_time: number;
  created_at: string;
}

export interface ContentStatus {
  id: string;
  content_type: 'video' | 'comment' | 'profile';
  content_id: string;
  status: 'visible' | 'masked' | 'under_review' | 'removed';
  reason: string;
  can_appeal: boolean;
  appeal_deadline: string | null;
  masked_at: string | null;
  updated_at: string;
}

export const moderationService = {
  async reportContent(
    contentType: 'video' | 'comment' | 'profile',
    contentId: string,
    reporterId: string,
    reason: string,
    description: string
  ): Promise<ContentReport | null> {
    const { data, error } = await supabase
      .from('content_reports')
      .insert({
        content_type: contentType,
        content_id: contentId,
        reporter_id: reporterId,
        reason: reason,
        description: description,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error reporting content:', error);
      return null;
    }

    return data;
  },

  async getPendingReports(): Promise<ContentReport[]> {
    const { data, error } = await supabase
      .from('content_reports')
      .select('*')
      .in('status', ['pending', 'under_review'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending reports:', error);
      return [];
    }

    return data;
  },

  async voteOnReport(
    reportId: string,
    voterId: string,
    vote: 'remove' | 'keep' | 'warn',
    comment: string
  ): Promise<ModerationVote | null> {
    const { data, error } = await supabase
      .from('moderation_votes')
      .insert({
        report_id: reportId,
        voter_id: voterId,
        vote: vote,
        comment: comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error voting on report:', error);
      return null;
    }

    return data;
  },

  async getReportVotes(reportId: string): Promise<ModerationVote[]> {
    const { data, error } = await supabase
      .from('moderation_votes')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching report votes:', error);
      return [];
    }

    return data;
  },

  async getContentStatus(
    contentType: 'video' | 'comment' | 'profile',
    contentId: string
  ): Promise<ContentStatus | null> {
    const { data, error } = await supabase
      .from('content_status')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching content status:', error);
      return null;
    }

    return data;
  },

  async updateContentStatus(
    contentType: 'video' | 'comment' | 'profile',
    contentId: string,
    status: 'visible' | 'masked' | 'under_review' | 'removed',
    reason: string
  ): Promise<ContentStatus | null> {
    const { data, error } = await supabase
      .from('content_status')
      .upsert({
        content_type: contentType,
        content_id: contentId,
        status: status,
        reason: reason,
        masked_at: status === 'masked' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating content status:', error);
      return null;
    }

    return data;
  },
};
