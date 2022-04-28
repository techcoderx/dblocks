const ProposalTypes = {
    1: {
        name: 'FUND_REQUEST',
        statuses: [
            'VOTING_ACTIVE',
            'VOTING_REJECTED',
            'FUNDING_ACTIVE',
            'FUNDING_SUCCESS',
            'FUNDING_FAILED',
            'REVIEW_IN_PROGRESS',
            'PROPOSAL_COMPLETE',
            'PROPOSAL_EXPIRED',
            'REVISION_REQUIRED'
        ]
    },
    2: {
        name: 'CHAIN_UPDATE',
        statuses: [
            'VOTING_ACTIVE',
            'VOTING_REJECTED',
            'VOTING_SUCCESS',
            'EXECUTED'
        ]
    }
}

const ProposalState = [
    'ACTIVE',
    'FAILED',
    'SUCCESS'
]