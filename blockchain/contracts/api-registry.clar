;; BitGate API Registry Contract
;; Manages registration and metadata of APIs on the BitGate platform

(define-data-var api-count uint u0)

(define-map apis
  { id: uint }
  {
    owner: principal,
    name: (string-ascii 50),
    price: uint,
    asset: (string-ascii 10),
    endpoint: (string-ascii 200),
    active: bool,
    usage-count: uint,
    earnings: uint
  }
)

;; Register a new API
(define-public (register-api
  (name (string-ascii 50))
  (price uint)
  (asset (string-ascii 10))
  (endpoint (string-ascii 200))
)
  (let
    (
      (id (+ (var-get api-count) u1))
    )
    (begin
      (map-set apis
        { id: id }
        {
          owner: tx-sender,
          name: name,
          price: price,
          asset: asset,
          endpoint: endpoint,
          active: true,
          usage-count: u0,
          earnings: u0
        }
      )
      (var-set api-count id)
      (ok id)
    )
  )
)

;; Get API info by ID
(define-read-only (get-api (id uint))
  (map-get? apis { id: id })
)

;; Get total number of registered APIs
(define-read-only (get-api-count)
  (var-get api-count)
)

;; Increment usage counter for an API (callable by payments contract)
(define-public (increment-usage (id uint))
  (match (map-get? apis { id: id })
    api
    (begin
      (map-set apis
        { id: id }
        (merge api { usage-count: (+ (get usage-count api) u1) })
      )
      (ok true)
    )
    (err u404)
  )
)

;; Add earnings to an API (callable by payments contract)
(define-public (add-earnings (id uint) (amount uint))
  (match (map-get? apis { id: id })
    api
    (begin
      (map-set apis
        { id: id }
        (merge api { earnings: (+ (get earnings api) amount) })
      )
      (ok true)
    )
    (err u404)
  )
)

;; Deactivate an API (only the owner can do this)
(define-public (deactivate-api (id uint))
  (match (map-get? apis { id: id })
    api
    (if (is-eq tx-sender (get owner api))
      (begin
        (map-set apis
          { id: id }
          (merge api { active: false })
        )
        (ok true)
      )
      (err u403)
    )
    (err u404)
  )
)
