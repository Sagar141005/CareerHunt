export const VALID_STATUS_TRANSITIONS = {
    null: ['Applied'],
    Applied: ['Withdrawn', 'Shortlisted'],
    Withdrawn: [],
    Shortlisted: ['On-hold', 'Interview', 'Rejected'],
    'On-hold': ['Interview', 'Rejected'],
    Interview: ['Rejected', 'Hired'],
    Rejected: [],
    Hired: []
};
  