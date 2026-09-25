import React from 'react';

/**
 * FieldItem - Renders an individual field in one of three explicit states:
 * - Confirmed: Subtle green tint with checkmark and value
 * - Needs clarification: Subtle amber with warning icon and 'Clarification needed'
 * - Not provided yet: Neutral gray with open circle
 */
function FieldItem({ label, isConfirmed, isClarification, isMissing, value, customContent }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-bold text-secondary uppercase tracking-wider">
        {label}
      </div>

      {/* State 1: Confirmed */}
      {isConfirmed && (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl transition-all">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Confirmed</span>
          </div>
          {customContent ? (
            customContent
          ) : (
            <div className="text-sm font-semibold text-primary break-words">
              {value}
            </div>
          )}
        </div>
      )}

      {/* State 2: Needs Clarification */}
      {isClarification && (
        <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl transition-all">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Needs clarification</span>
          </div>
          {value && (
            <div className="text-sm font-medium text-amber-950 break-words mb-1">
              {value}
            </div>
          )}
          <div className="text-xs text-amber-700 font-medium">
            Clarification needed
          </div>
        </div>
      )}

      {/* State 3: Not provided yet */}
      {isMissing && (
        <div className="p-2.5 bg-background-subtle/80 border border-primary/5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-light">
            <svg className="w-3.5 h-3.5 opacity-50 flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="10" cy="10" r="7" />
            </svg>
            <span>Not provided yet</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StructuredStatePanel({ state = {}, completion, needsClarification = [] }) {
  const needsClarificationSet = new Set(needsClarification || []);

  // Personal details
  const isNameClarif = needsClarificationSet.has('full_name');
  const isNameConfirmed = !isNameClarif && Boolean(state?.full_name);
  const isNameMissing = !isNameClarif && !isNameConfirmed;

  const isAddressClarif = needsClarificationSet.has('home_address');
  const isAddressConfirmed = !isAddressClarif && Boolean(state?.home_address);
  const isAddressMissing = !isAddressClarif && !isAddressConfirmed;

  // Document scope
  const isScopeClarif = needsClarificationSet.has('covers_worldwide_assets');
  const isScopeConfirmed = !isScopeClarif && state?.covers_worldwide_assets !== null && state?.covers_worldwide_assets !== undefined;
  const isScopeMissing = !isScopeClarif && !isScopeConfirmed;
  const scopeValue = state?.covers_worldwide_assets === true
    ? 'Yes (Covers worldwide assets)'
    : state?.covers_worldwide_assets === false
    ? 'No (Jurisdiction-specific only)'
    : null;

  // Family: has children
  const isHasChildrenClarif = needsClarificationSet.has('has_children');
  const isHasChildrenConfirmed = !isHasChildrenClarif && state?.has_children !== null && state?.has_children !== undefined;
  const isHasChildrenMissing = !isHasChildrenClarif && !isHasChildrenConfirmed;
  const hasChildrenValue = state?.has_children === true ? 'Yes' : state?.has_children === false ? 'No' : null;

  // Family: children list
  const isChildrenClarif = needsClarificationSet.has('children');
  const hasChildrenList = state?.has_children === true && Array.isArray(state?.children) && state.children.length > 0;
  const isChildrenConfirmed = !isChildrenClarif && hasChildrenList;
  const isChildrenMissing = !isChildrenClarif && !isChildrenConfirmed;
  const isFamilyConfirmed = isHasChildrenConfirmed && (state?.has_children === false || isChildrenConfirmed);

  // Executor
  const isExecNameClarif = needsClarificationSet.has('executor.name') || needsClarificationSet.has('executor');
  const isExecNameConfirmed = !isExecNameClarif && Boolean(state?.executor?.name);
  const isExecNameMissing = !isExecNameClarif && !isExecNameConfirmed;

  const isExecRelClarif = needsClarificationSet.has('executor.relationship');
  const isExecRelConfirmed = !isExecRelClarif && Boolean(state?.executor?.relationship);
  const isExecRelMissing = !isExecRelClarif && !isExecRelConfirmed;
  const isExecutorConfirmed = isExecNameConfirmed && isExecRelConfirmed;

  // Gifts & Wishes
  const isGiftsClarif = needsClarificationSet.has('specific_gifts');
  const hasSpecificGiftsList = Array.isArray(state?.specific_gifts) && state.specific_gifts.length > 0;
  const hasExplicitNoGifts = state?.has_specific_gifts === false || 
                             (state?.has_specific_gifts === null && (!state?.specific_gifts || state.specific_gifts.length === 0) && 
                              (state?.additional_wishes === 'None' || state?.additional_wishes === 'No additional wishes'));
  const isGiftsConfirmed = !isGiftsClarif && (hasSpecificGiftsList || hasExplicitNoGifts);
  const isGiftsMissing = !isGiftsClarif && !isGiftsConfirmed;

  const isWishesClarif = needsClarificationSet.has('additional_wishes');
  const hasWishesContent = Boolean(state?.additional_wishes && state.additional_wishes.trim() !== '');
  const isWishesConfirmed = !isWishesClarif && hasWishesContent;
  const isWishesMissing = !isWishesClarif && !isWishesConfirmed;

  const wishesDisplayValue = hasWishesContent
    ? (state.additional_wishes.toLowerCase() === 'none' || state.additional_wishes.toLowerCase() === 'no additional wishes'
        ? 'None (No additional wishes)'
        : state.additional_wishes)
    : null;

  // 7 Core Intake Checklist Items:
  // 1. Full Name, 2. Home Address, 3. Worldwide Assets, 4. Family/Children, 5. Executor, 6. Specific Gifts, 7. Additional Wishes
  const confirmedItems = [
    isNameConfirmed,
    isAddressConfirmed,
    isScopeConfirmed,
    isFamilyConfirmed,
    isExecutorConfirmed,
    isGiftsConfirmed,
    isWishesConfirmed
  ];

  const confirmedCount = confirmedItems.filter(Boolean).length;
  const totalCount = 7;

  return (
    <div className="bg-paper rounded-2xl shadow-paper border border-primary/5 sticky top-20 flex flex-col max-h-[calc(100vh-100px)]">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-primary/10 flex justify-between items-center bg-background-subtle rounded-t-2xl flex-shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-primary font-serif">
            Structured Information
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Synced with conversation</span>
          </div>
        </div>
        <div className="bg-primary/5 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/10 whitespace-nowrap">
          {confirmedCount} of {totalCount} confirmed
        </div>
      </div>

      {/* Scrollable Structured Sections */}
      <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
        {/* SECTION 1: PERSONAL DETAILS */}
        <div>
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Personal Details
          </h3>
          <div className="space-y-3">
            <FieldItem 
              label="Full Name" 
              isConfirmed={isNameConfirmed} 
              isClarification={isNameClarif} 
              isMissing={isNameMissing} 
              value={state?.full_name} 
            />
            <FieldItem 
              label="Home Address" 
              isConfirmed={isAddressConfirmed} 
              isClarification={isAddressClarif} 
              isMissing={isAddressMissing} 
              value={state?.home_address} 
            />
          </div>
        </div>

        {/* SECTION 2: DOCUMENT SCOPE */}
        <div className="pt-2 border-t border-primary/5">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
              <circle cx="7.5" cy="7.5" r="6" />
              <path d="M1.5 7.5h12M7.5 1.5c1.8 1.5 2.5 3.8 2.5 6s-.7 4.5-2.5 6c-1.8-1.5-2.5-3.8-2.5-6s.7-4.5 2.5-6z"/>
            </svg>
            Document Scope
          </h3>
          <FieldItem 
            label="Worldwide Assets" 
            isConfirmed={isScopeConfirmed} 
            isClarification={isScopeClarif} 
            isMissing={isScopeMissing} 
            value={scopeValue} 
          />
        </div>

        {/* SECTION 3: FAMILY */}
        <div className="pt-2 border-t border-primary/5">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Family
          </h3>
          <div className="space-y-3">
            <FieldItem 
              label="Has Children" 
              isConfirmed={isHasChildrenConfirmed} 
              isClarification={isHasChildrenClarif} 
              isMissing={isHasChildrenMissing} 
              value={hasChildrenValue} 
            />

            {/* Show Children list if user has children or status is pending */}
            {state?.has_children !== false && (
              <FieldItem 
                label="Children" 
                isConfirmed={isChildrenConfirmed} 
                isClarification={isChildrenClarif} 
                isMissing={isChildrenMissing} 
                customContent={
                  <ul className="space-y-1 mt-1">
                    {state?.children?.map((child, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-primary font-medium">
                        <span className="text-secondary-lighter">•</span>
                        <span>{child.name}</span>
                      </li>
                    ))}
                  </ul>
                }
              />
            )}
          </div>
        </div>

        {/* SECTION 4: EXECUTOR (COHESIVE GROUP) */}
        <div className="pt-2 border-t border-primary/5">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            Executor
          </h3>
          <div className="p-3.5 bg-background-subtle/60 rounded-xl border border-primary/10 space-y-3">
            <FieldItem 
              label="Name" 
              isConfirmed={isExecNameConfirmed} 
              isClarification={isExecNameClarif} 
              isMissing={isExecNameMissing} 
              value={state?.executor?.name} 
            />
            <div className="pt-2 border-t border-primary/5">
              <FieldItem 
                label="Relationship" 
                isConfirmed={isExecRelConfirmed} 
                isClarification={isExecRelClarif} 
                isMissing={isExecRelMissing} 
                value={state?.executor?.relationship} 
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: GIFTS & WISHES */}
        <div className="pt-2 border-t border-primary/5">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary">
              <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
            Gifts & Wishes
          </h3>
          <div className="space-y-3">
            <FieldItem 
              label="Specific Gifts" 
              isConfirmed={isGiftsConfirmed} 
              isClarification={isGiftsClarif} 
              isMissing={isGiftsMissing} 
              customContent={
                hasSpecificGiftsList ? (
                  <div className="space-y-2 mt-1.5">
                    {state?.specific_gifts?.map((gift, idx) => (
                      <div key={idx} className="bg-white/80 p-2.5 rounded-lg border border-emerald-200/50">
                        <div className="font-semibold text-primary text-sm">{gift.recipient}</div>
                        <div className="text-secondary text-xs flex items-center gap-1.5 mt-0.5 font-medium">
                          <span className="text-accent font-bold">→</span>
                          <span>{gift.item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-primary">
                    None (No specific gifts)
                  </div>
                )
              }
            />
            <FieldItem 
              label="Additional Wishes" 
              isConfirmed={isWishesConfirmed} 
              isClarification={isWishesClarif} 
              isMissing={isWishesMissing} 
              value={wishesDisplayValue} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StructuredStatePanel;
