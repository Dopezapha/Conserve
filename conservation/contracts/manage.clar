;; Conservation Smart Contract with Clear Variable Names
;; Simplified and clear naming conventions for better readability

;; Error Constants - Clear and descriptive names
(define-constant owner tx-sender)
(define-constant ERROR-NOT-OWNER (err u100))
(define-constant ERROR-ALREADY-SETUP (err u101))
(define-constant ERROR-NOT-SETUP (err u102))
(define-constant ERROR-BAD-AMOUNT (err u103))
(define-constant ERROR-LOW-BALANCE (err u104))
(define-constant ERROR-DUPLICATE-PROJECT (err u105))
(define-constant ERROR-NO-PROJECT (err u106))
(define-constant ERROR-NO-PERMISSION (err u107))
(define-constant ERROR-ALREADY-APPROVED (err u108))
(define-constant ERROR-NO-MILESTONE (err u109))
(define-constant ERROR-INVALID-TIME (err u110))
(define-constant ERROR-VOTE-CLOSED (err u111))
(define-constant ERROR-ALREADY-VOTED (err u112))
(define-constant ERROR-PROJECT-CLOSED (err u113))

;; Project Types List
(define-constant project-types 
    (list 
        "wildlife"
        "forest"
        "marine"
        "climate"
        "biodiversity"
    )
)

;; Main Project Data Structure
(define-map ProjectDetails
    { project-id: uint }
    {
        creator: principal,
        project-name: (string-ascii 50),
        project-info: (string-ascii 500),
        project-site: (string-ascii 100),
        project-type: (string-ascii 20),
        funding-goal: uint,
        current-funds: uint,
        project-status: (string-ascii 20),
        is-approved: bool,
        start-block: uint,
        end-block: uint,
        impact-rating: uint,
        vote-count: uint,
        completed-milestones: uint
    }
)

;; Donation Tracking
(define-map DonorInfo
    { project-id: uint, donor-address: principal }
    { 
        donation-amount: uint,
        last-donation-date: uint,
        donation-count: uint,
        rewards-taken: bool
    }
)

;; Project Approvers List
(define-map ApproverList principal bool)

;; Project Milestones
(define-map MilestoneInfo
    { project-id: uint, milestone-id: uint }
    {
        milestone-desc: (string-ascii 200),
        due-date: uint,
        is-complete: bool,
        completion-proof: (buff 32),
        approver: (optional principal)
    }
)

;; Voting Records
(define-map VoteRecords
    { project-id: uint, voter-address: principal }
    {
        tokens-staked: uint,
        vote-date: uint,
        vote-choice: (string-ascii 10)
    }
)

;; Environmental Impact Data
(define-map EnvironmentalMetrics
    { project-id: uint }
    {
        tree-count: uint,
        protected-area: uint,
        carbon-reduced: uint,
        species-count: uint,
        social-impact: uint
    }
)

;; Contract State Variables
(define-data-var next-project-id uint u0)
(define-data-var project-count uint u0)
(define-data-var is-contract-active bool false)
(define-data-var stake-requirement uint u100)
(define-data-var vote-duration uint u1440) ;; 10 days in blocks

;; Initialize Contract
(define-public (setup-contract)
    (begin
        (asserts! (is-eq tx-sender owner) ERROR-NOT-OWNER)
        (asserts! (not (var-get is-contract-active)) ERROR-ALREADY-SETUP)
        (var-set is-contract-active true)
        (ok true)
    )
)

;; Update Minimum Stake
(define-public (set-min-stake (new-min-stake uint))
    (begin
        (asserts! (is-eq tx-sender owner) ERROR-NOT-OWNER)
        (var-set stake-requirement new-min-stake)
        (ok true)
    )
)

;; Create New Project
(define-public (start-project 
    (name (string-ascii 50))
    (info (string-ascii 500))
    (site (string-ascii 100))
    (type (string-ascii 20))
    (goal-amount uint)
    (duration uint))
    (let
        (
            (project-id (+ (var-get next-project-id) u1))
            (project-end (+ block-height duration))
        )
        (asserts! (> goal-amount u0) ERROR-BAD-AMOUNT)
        (asserts! (> duration u0) ERROR-INVALID-TIME)
        
        ;; Stake tokens
        (try! (stx-transfer? (var-get stake-requirement) tx-sender (as-contract tx-sender)))
        
        (map-set ProjectDetails
            { project-id: project-id }
            {
                creator: tx-sender,
                project-name: name,
                project-info: info,
                project-site: site,
                project-type: type,
                funding-goal: goal-amount,
                current-funds: u0,
                project-status: "active",
                is-approved: false,
                start-block: block-height,
                end-block: project-end,
                impact-rating: u0,
                vote-count: u0,
                completed-milestones: u0
            }
        )
        (var-set next-project-id project-id)
        (var-set project-count (+ (var-get project-count) u1))
        (ok project-id)
    )
)

;; Add Project Milestone
(define-public (add-project-milestone 
    (project-id uint)
    (description (string-ascii 200))
    (deadline uint))
    (let
        (
            (project (unwrap! (map-get? ProjectDetails { project-id: project-id }) ERROR-NO-PROJECT))
            (milestone-num (get completed-milestones project))
        )
        (asserts! (is-eq (get creator project) tx-sender) ERROR-NO-PERMISSION)
        (asserts! (> deadline block-height) ERROR-INVALID-TIME)
        
        (map-set MilestoneInfo
            { project-id: project-id, milestone-id: milestone-num }
            {
                milestone-desc: description,
                due-date: deadline,
                is-complete: false,
                completion-proof: 0x,
                approver: none
            }
        )
        (ok true)
    )
)

;; Complete Milestone
(define-public (finish-milestone 
    (project-id uint)
    (milestone-id uint)
    (proof (buff 32)))
    (let
        (
            (project (unwrap! (map-get? ProjectDetails { project-id: project-id }) ERROR-NO-PROJECT))
            (milestone (unwrap! (map-get? MilestoneInfo { project-id: project-id, milestone-id: milestone-id }) ERROR-NO-MILESTONE))
        )
        (asserts! (is-eq (get creator project) tx-sender) ERROR-NO-PERMISSION)
        (asserts! (not (get is-complete milestone)) ERROR-ALREADY-APPROVED)
        
        (map-set MilestoneInfo
            { project-id: project-id, milestone-id: milestone-id }
            (merge milestone {
                is-complete: true,
                completion-proof: proof
            })
        )
        
        (map-set ProjectDetails
            { project-id: project-id }
            (merge project {
                completed-milestones: (+ (get completed-milestones project) u1)
            })
        )
        (ok true)
    )
)

;; Cast Vote
(define-public (cast-vote 
    (project-id uint)
    (stake-amount uint)
    (choice (string-ascii 10)))
    (let
        (
            (project (unwrap! (map-get? ProjectDetails { project-id: project-id }) ERROR-NO-PROJECT))
            (existing-vote (map-get? VoteRecords { project-id: project-id, voter-address: tx-sender }))
        )
        (asserts! (is-eq (get project-status project) "active") ERROR-PROJECT-CLOSED)
        (asserts! (not existing-vote) ERROR-ALREADY-VOTED)
        (asserts! (>= (- (get end-block project) block-height) (var-get vote-duration)) ERROR-VOTE-CLOSED)
        
        (try! (stx-transfer? stake-amount tx-sender (as-contract tx-sender)))
        
        (map-set VoteRecords
            { project-id: project-id, voter-address: tx-sender }
            {
                tokens-staked: stake-amount,
                vote-date: block-height,
                vote-choice: choice
            }
        )
        
        (map-set ProjectDetails
            { project-id: project-id }
            (merge project {
                vote-count: (+ (get vote-count project) u1)
            })
        )
        (ok true)
    )
)

;; Record Environmental Impact
(define-public (record-impact
    (project-id uint)
    (trees uint)
    (area uint)
    (carbon uint)
    (species uint)
    (community uint))
    (let
        (
            (project (unwrap! (map-get? ProjectDetails { project-id: project-id }) ERROR-NO-PROJECT))
        )
        (asserts! (is-eq (get creator project) tx-sender) ERROR-NO-PERMISSION)
        
        (map-set EnvironmentalMetrics
            { project-id: project-id }
            {
                tree-count: trees,
                protected-area: area,
                carbon-reduced: carbon,
                species-count: species,
                social-impact: community
            }
        )
        
        (map-set ProjectDetails
            { project-id: project-id }
            (merge project {
                impact-rating: (+ trees area carbon species community)
            })
        )
        (ok true)
    )
)

;; Read-only Functions

;; Get Project Impact Data
(define-read-only (get-impact-data (project-id uint))
    (map-get? EnvironmentalMetrics { project-id: project-id })
)

;; Get Project Milestone Details
(define-read-only (get-milestone-details (project-id uint) (milestone-id uint))
    (map-get? MilestoneInfo { project-id: project-id, milestone-id: milestone-id })
)

;; Get Vote Details
(define-read-only (get-vote-details (project-id uint) (voter-address principal))
    (map-get? VoteRecords { project-id: project-id, voter-address: voter-address })
)

;; Get Project Performance Metrics
(define-read-only (get-project-performance (project-id uint))
    (match (map-get? ProjectDetails { project-id: project-id })
        project (ok {
            funding-percent: (/ (* (get current-funds project) u100) (get funding-goal project)),
            milestone-percent: (/ (* (get completed-milestones project) u100) u5),
            impact-score: (get impact-rating project),
            total-voters: (get vote-count project)
        })
        ERROR-NO-PROJECT
    )
)

;; Get Project Timeline Stats
(define-read-only (get-project-timeline (project-id uint))
    (match (map-get? ProjectDetails { project-id: project-id })
        project (ok {
            remaining-days: (/ (- (get end-block project) block-height) u144),
            donor-count: (get vote-count project),
            current-impact: (get impact-rating project),
            milestone-count: (get completed-milestones project)
        })
        ERROR-NO-PROJECT
    )
)