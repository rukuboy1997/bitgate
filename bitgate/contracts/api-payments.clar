;; BitGate Payments Contract
;; Handles API payment recording and calls back into the registry
;; Supports multi-asset payments (USDCx, sBTC, STX, etc.)

(define-constant registry .api-registry)

(define-map payments
  {
    user: principal,
    api-id: uint
  }
  {
    paid: bool,
    amount: uint,
    asset: (string-ascii 10),
    block: uint
  }
)

;; Record a payment for an API with asset type (e.g. "USDCx", "sBTC", "STX")
;; Updates the payment map, increments usage, and adds earnings in the registry
(define-public (record-payment
  (api-id uint)
  (amount uint)
  (asset (string-ascii 10))
)
  (begin
    (map-set payments
      {
        user: tx-sender,
        api-id: api-id
      }
      {
        paid: true,
        amount: amount,
        asset: asset,
        block: stacks-block-height
      }
    )
    (try! (contract-call? registry increment-usage api-id))
    (try! (contract-call? registry add-earnings api-id amount))
    (ok true)
  )
)

;; Get full payment record for a user + API combination
;; Returns: { paid, amount, asset, block } or none
(define-read-only (get-payment (user principal) (api-id uint))
  (map-get? payments
    {
      user: user,
      api-id: api-id
    }
  )
)

;; Simple boolean check - has this user paid for this API?
(define-read-only (has-paid (user principal) (api-id uint))
  (match (map-get? payments
    {
      user: user,
      api-id: api-id
    })
    payment (ok (get paid payment))
    (ok false)
  )
)
