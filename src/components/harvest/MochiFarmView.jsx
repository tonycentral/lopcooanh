import React, { useState } from 'react';
import FarmAreaNavSidebar from './FarmAreaNavSidebar';
import HarvestAreaWorld from './HarvestAreaWorld';
import AreaTopicPracticeModal from './AreaTopicPracticeModal';
import DailyAlmanacModal from './DailyAlmanacModal';
import GrammarPastureModal from './GrammarPastureModal';
import KitchenModal from './KitchenModal';
import SeedVaultModal from './SeedVaultModal';
import GeneralStoreModal from './GeneralStoreModal';
import BackpackModal from './BackpackModal';
import TownBulletinModal from './TownBulletinModal';

import { 
  getHarvestTownState, 
  saveHarvestTownState,
  switchActiveArea,
  buyGeneralStoreItem,
  FARM_AREAS
} from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';

export default function MochiFarmView({
  studentEmail,
  onOpenTargetBandModal,
  onOpenAuthModal,
  onOpenSettingsModal,
  currentUser,
  onSignOut
}) {
  const [harvestState, setHarvestState] = useState(() => getHarvestTownState(studentEmail));
  const [selectedEntityForPractice, setSelectedEntityForPractice] = useState(null);

  // Modals state
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isPastureOpen, setIsPastureOpen] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [isSeedVaultOpen, setIsSeedVaultOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);

  // Switch between 5 areas
  const handleSelectArea = (areaId) => {
    const res = switchActiveArea(areaId, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    }
  };

  // Buy item from General Store
  const handleBuyStoreItem = (itemId) => {
    const res = buyGeneralStoreItem(itemId, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    } else {
      alert(res.message);
    }
  };

  // Active Area Info
  const activeAreaId = harvestState.activeArea || 'paddy';
  const currentArea = FARM_AREAS.find(a => a.id === activeAreaId) || FARM_AREAS[0];
  const activeEntities = harvestState.areaEntities?.[currentArea.id] || [];

  // Unified User Display Name
  const userDisplayName = 
    currentUser?.user_metadata?.full_name || 
    (currentUser?.email ? currentUser.email.split('@')[0] : null) || 
    (studentEmail ? studentEmail.split('@')[0] : null) || 
    harvestState.farmerName || 
    'Tony Nguyen';

  return (
    <div className="h-full w-full max-h-screen overflow-hidden flex flex-row relative select-none font-sans text-[#FFF8E7] bg-[#140B05]">
      
      {/* =========================================================================
          LEFT SIDEBAR: COMPLETE CONTROLS, PROFILE, 2 CURRENCIES & 5 FARM AREAS
          (Đã loại bỏ hoàn toàn thanh Top Bar, sáp nhập mọi điều khiển vào Sidebar trái)
          ========================================================================= */}
      <FarmAreaNavSidebar
        state={harvestState}
        activeAreaId={activeAreaId}
        onSelectArea={handleSelectArea}
        onOpenTargetBandModal={onOpenTargetBandModal}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenAlmanac={() => setIsAlmanacOpen(true)}
        currentUser={currentUser}
        studentEmail={studentEmail}
        onOpenAuthModal={onOpenAuthModal}
        onOpenSettingsModal={onOpenSettingsModal}
        onSignOut={onSignOut}
      />

      {/* =========================================================================
          FULL-SCREEN GAME VIEWPORT: LIVING 2D RETRO GAME WORLD
          ========================================================================= */}
      <main className="flex-1 min-h-0 h-full relative overflow-hidden">
        <HarvestAreaWorld
          activeArea={currentArea}
          entities={activeEntities}
          onSelectEntity={(entity) => setSelectedEntityForPractice(entity)}
          onOpenStore={() => setIsStoreOpen(true)}
          onOpenAlmanac={() => setIsAlmanacOpen(true)}
          farmerName={userDisplayName}
          farmerLevel={harvestState.level}
          mana={harvestState.mana}
          gold={harvestState.gold}
        />
      </main>

      {/* =========================================================================
          INTERACTIVE IELTS PRACTICE MODAL FOR THE 10 TOPIC ENTITIES
          ========================================================================= */}
      {selectedEntityForPractice && (
        <AreaTopicPracticeModal
          isOpen={!!selectedEntityForPractice}
          onClose={() => setSelectedEntityForPractice(null)}
          entity={selectedEntityForPractice}
          activeArea={currentArea}
          studentEmail={studentEmail}
          onPracticeCompleted={(res) => {
            if (res.state) {
              setHarvestState(res.state);
            }
          }}
        />
      )}

      {/* =========================================================================
          SUPPORTING GAME SIMULATION MODALS
          ========================================================================= */}
      
      {/* Morning Almanac */}
      <DailyAlmanacModal
        isOpen={isAlmanacOpen}
        onClose={() => setIsAlmanacOpen(false)}
        almanacState={harvestState.almanac}
        onAlmanacUpdated={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* General Store (Tiệm Nông Cụ & Phục Hồi Mana / Dinh Dưỡng) */}
      <GeneralStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        userGold={harvestState.gold}
        onBuyItem={handleBuyStoreItem}
        ownedDecor={harvestState.ownedDecor}
      />

      {/* Seed Vault */}
      <SeedVaultModal
        isOpen={isSeedVaultOpen}
        onClose={() => setIsSeedVaultOpen(false)}
        seedVault={harvestState.seedVault}
      />

      {/* Kitchen Modal */}
      <KitchenModal
        isOpen={isKitchenOpen}
        onClose={() => setIsKitchenOpen(false)}
        pantryState={harvestState.kitchenPantry}
        onCookCompleted={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* Grammar Pasture Modal */}
      <GrammarPastureModal
        isOpen={isPastureOpen}
        onClose={() => setIsPastureOpen(false)}
        livestockState={harvestState.livestock}
        onCareCompleted={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* Backpack Modal */}
      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        inventory={harvestState.inventory}
        shippingBin={harvestState.shippingBin}
        onShipItem={() => {}}
        onSettleShipping={() => {}}
      />

      {/* Town Bulletin */}
      <TownBulletinModal
        isOpen={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
        commissions={harvestState.dailyCommissions}
        onClaimCommission={() => {}}
        onGoPractice={() => {}}
      />

    </div>
  );
}
