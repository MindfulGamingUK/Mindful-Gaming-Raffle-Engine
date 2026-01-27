# Deployment Checklist (React + Wix Velo)

## 1. Frontend Build
- [ ] Run `npm run build`.
- [ ] Ensure `main.js` and `main.css` are generated.
- [ ] Verify SVGs are included in the assets folder.

## 2. Wix Custom Element
- [ ] Upload build artifacts to Wix Hosting or external CDN.
- [ ] Create Custom Element in Wix Editor.
- [ ] Set tag name: `mindful-raffle-app`.
- [ ] Set Script URL to hosted `main.js`.
- [ ] Add Attribute `data-mode="embedded"`.

## 3. Velo Backend Setup (Antigravity)
- [ ] Create `backend/http-functions.js` (Public API).
- [ ] Implement `get_session`, `post_profile`, `get_raffles`, `post_entry_intent`.
- [ ] Create CMS Collections: `Raffles`, `Entries`, `Profiles`.

## 4. Configuration Injection
- [ ] In Wix `masterPage.js` (Global Code):
```javascript
$w.onReady(function () {
    const appConfig = {
        promoterName: "Board of Trustees",
        promoterAddress: "Registered Address, UK",
        localAuthorityName: "Birmingham City Council",
        lotteryRegistrationRef: "LN/REAL_REF_HERE",
        apiMode: "VELO" 
    };
    
    // Inject into Window for the React App to read
    $w('#customElement1').setAttribute('data-config', JSON.stringify(appConfig));
    // OR use postMessage if attributes are too small
});
```

## 5. Validation
- [ ] Verify "Registered with" appears in footer.
- [ ] Verify Age Gate allows 18+ only.
- [ ] Test purchase flow creates a pending entry in CMS.
