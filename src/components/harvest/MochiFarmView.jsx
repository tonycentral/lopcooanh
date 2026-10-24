import React, { useState } from 'react';
import HarvestHUD from './HarvestHUD';
import HarvestTownMap from './HarvestTownMap';
import HarvestToolbar from './HarvestToolbar';
import DailyAlmanacModal from './DailyAlmanacModal';
import GrammarPastureModal from './GrammarPastureModal';
import KitchenModal from './KitchenModal';
import SeedVaultModal from './SeedVaultModal';
import PestChallengeModal from './PestChallengeModal';
import SeedPouchModal from './SeedPouchModal';
import ShippingSettlementModal from './ShippingSettlementModal';
import TownBulletinModal from './TownBulletinModal';
import CoOanhManorModal from './CoOanhManorModal';
import GeneralStoreModal from './GeneralStoreModal';
import BackpackModal from './BackpackModal';
import RevivalQuestModal from '../farm/RevivalQuestModal';
import FieldPracticeModal from './FieldPracticeModal';

import { 
  getHarvestTownState, 
  saveHarvestTownState,
  plantSeed, 
  harvestCrop, 
  shipItemFromBackpack, 
  settleShippingBin, 
  claimCommissionReward, 
  buyGeneralStoreItem, 
  clearWeedsWithRevival,
  recordLearningToFarm 
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
  const [activeTool, setActiveTool] = useState('hoe');

  // Modals state for Core Mechanics
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [isPastureOpen, setIsPastureOpen] = useState(false);
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [isSeedVaultOpen, setIsSeedVaultOpen] = useState(false);
  const [selectedPestPlot, setSelectedPestPlot] = useState(null);

  // Standard Farm Modals
  const [isSeedPouchOpen, setIsSeedPouchOpen] = useState(false);
  const [selectedPlotForSeed, setSelectedPlotForSeed] = useState(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [settlementData, setSettlementData] = useState(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [isCoOanhOpen, setIsCoOanhOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isRevivalOpen, setIsRevivalOpen] = useState(false);

  // Field Practice Modal
  const [isFieldPracticeOpen, setIsFieldPracticeOpen] = useState(false);
  const [practiceSkill, setPracticeSkill] = useState('vocab');
  const [practicePlotId, setPracticePlotId] = useState(null);

  // 1. Gieo Hạt
  const handlePlant = (cropKey, plotId) => {
    if (!plotId) return;
    const res = plantSeed(plotId, cropKey, null, studentEmail);
    if (res.success) {
      sounds.playWater();
      setHarvestState(res.state);
    } else {
      alert(res.message);
    }
  };

  // 2. Thu Hoạch Cây Chín
  const handleHarvest = (plotId) => {
    const res = harvestCrop(plotId, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
      if (res.isHeirloomMastered) {
        sounds.playFanfare();
        alert(`🌟 KỲ TÍCH HỌC THUẬT! Từ vựng trên cây đã đạt mốc Mastered (Heirloom) và được chuyển vào Hầm Hạt Giống (Seed Vault) để sinh lãi Gold mỗi sáng!`);
      }
    }
  };

  // 3. Tưới nước bằng bài tập luyện tập trong game
  const handleWaterWithPractice = (skillType, plotId = null) => {
    setPracticeSkill(skillType || 'vocab');
    setPracticePlotId(plotId);
    setIsFieldPracticeOpen(true);
  };

  const handleCompleteFieldPractice = (skillType, score) => {
    const res = recordLearningToFarm(skillType, score, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    }
  };

  // 4. Bỏ hàng vào thùng xuất khẩu
  const handleShipItem = (inventoryId, qty = 1) => {
    const res = shipItemFromBackpack(inventoryId, qty, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    }
  };

  // 5. Kết toán xuất khẩu buổi tối (Settle daily shipping)
  const handleSettleShipping = () => {
    const res = settleShippingBin(studentEmail);
    if (res.success) {
      setHarvestState(res.state);
      setSettlementData(res);
      setIsBackpackOpen(false);
      setIsShippingModalOpen(true);
    } else {
      alert(res.message);
    }
  };

  // 6. Nhận thưởng nhiệm vụ Bảng tin
  const handleClaimCommission = (commId) => {
    const res = claimCommissionReward(commId, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    }
  };

  // 7. Mua đồ từ Tiệm Nông cụ
  const handleBuyStoreItem = (itemId) => {
    const res = buyGeneralStoreItem(itemId, studentEmail);
    if (res.success) {
      setHarvestState(res.state);
    } else {
      alert(res.message);
    }
  };

  // 8. Dọn cỏ hồi sinh
  const handleCompleteRevival = () => {
    const res = clearWeedsWithRevival(studentEmail);
    if (res.success) {
      setHarvestState(res.state);
      setIsRevivalOpen(false);
      sounds.playFanfare();
    }
  };

  const unclaimedCommissionsCount = harvestState.dailyCommissions?.filter(c => c.done && !c.claimed).length || 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#254520] overflow-y-auto pb-24 relative select-none font-sans text-[#FFF8E7]">
      
      {/* 1. RETRO PIXEL HUD (Top Bar) */}
      <HarvestHUD
        state={harvestState}
        onOpenTargetBandModal={onOpenTargetBandModal}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        onOpenAlmanac={() => setIsAlmanacOpen(true)}
        onOpenPasture={() => setIsPastureOpen(true)}
        onOpenKitchen={() => setIsKitchenOpen(true)}
        onOpenSeedVault={() => setIsSeedVaultOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={onOpenAuthModal}
        onOpenSettingsModal={onOpenSettingsModal}
        onSignOut={onSignOut}
      />

      {/* 2. MAIN HARVEST TOWN FARM MAP */}
      <HarvestTownMap
        state={harvestState}
        onHarvestPlot={handleHarvest}
        onPlantPlot={handlePlant}
        onWaterPlotWithPractice={handleWaterWithPractice}
        onOpenSeedPouch={(plotId) => {
          setSelectedPlotForSeed(plotId);
          setIsSeedPouchOpen(true);
        }}
        onOpenShippingBin={() => setIsBackpackOpen(true)}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        onOpenCoOanhManor={() => setIsCoOanhOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenMines={() => handleWaterWithPractice('reading')}
        onOpenFishing={() => handleWaterWithPractice('pronunciation')}
        onOpenAlmanac={() => setIsAlmanacOpen(true)}
        onOpenPasture={() => setIsPastureOpen(true)}
        onOpenKitchen={() => setIsKitchenOpen(true)}
        onOpenSeedVault={() => setIsSeedVaultOpen(true)}
        onOpenPestChallenge={(plot) => setSelectedPestPlot(plot)}
        onClearWeeds={() => setIsRevivalOpen(true)}
      />

      {/* 3. RETRO BOTTOM HOTBAR (Toolbelt) */}
      <HarvestToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onOpenAlmanac={() => setIsAlmanacOpen(true)}
        onOpenKitchen={() => setIsKitchenOpen(true)}
        onOpenPasture={() => setIsPastureOpen(true)}
        onOpenSeedPouch={() => {
          setSelectedPlotForSeed(null);
          setIsSeedPouchOpen(true);
        }}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        unclaimedQuestsCount={unclaimedCommissionsCount}
        shippingCount={harvestState.shippingBin?.length || 0}
      />

      {/* =========================================================================
          MODALS FOR CORE LEARNING SIMULATION MECHANICS
          ========================================================================= */}

      {/* Mechanic 1: Morning Almanac (The Study Gate) */}
      <DailyAlmanacModal
        isOpen={isAlmanacOpen}
        onClose={() => setIsAlmanacOpen(false)}
        almanacState={harvestState.almanac}
        onAlmanacUpdated={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* Mechanic 4: Animals as Grammar (Livestock Pasture) */}
      <GrammarPastureModal
        isOpen={isPastureOpen}
        onClose={() => setIsPastureOpen(false)}
        livestockState={harvestState.livestock}
        onCareCompleted={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* Mechanic 5: The Kitchen (Collocations & Chunks) */}
      <KitchenModal
        isOpen={isKitchenOpen}
        onClose={() => setIsKitchenOpen(false)}
        pantryState={harvestState.kitchenPantry}
        onCookCompleted={(newState) => setHarvestState(newState)}
        studentEmail={studentEmail}
      />

      {/* Mechanic 2: Permanent Seed Vault (Mastered Heirlooms) */}
      <SeedVaultModal
        isOpen={isSeedVaultOpen}
        onClose={() => setIsSeedVaultOpen(false)}
        seedVault={harvestState.seedVault}
      />

      {/* Mechanic 3: Pest Challenge (Targeted Error Remediation) */}
      {selectedPestPlot && (
        <PestChallengeModal
          isOpen={!!selectedPestPlot}
          onClose={() => setSelectedPestPlot(null)}
          plot={selectedPestPlot}
          onPestDefeated={(newState) => {
            setHarvestState(newState);
            setSelectedPestPlot(null);
          }}
          studentEmail={studentEmail}
        />
      )}

      {/* Standard Modals */}
      <FieldPracticeModal
        isOpen={isFieldPracticeOpen}
        onClose={() => setIsFieldPracticeOpen(false)}
        skillType={practiceSkill}
        plotId={practicePlotId}
        onCompletePractice={handleCompleteFieldPractice}
      />

      <SeedPouchModal
        isOpen={isSeedPouchOpen}
        onClose={() => {
          setIsSeedPouchOpen(false);
          setSelectedPlotForSeed(null);
        }}
        onSelectSeed={handlePlant}
        userGold={harvestState.gold}
        selectedPlotId={selectedPlotForSeed}
      />

      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        inventory={harvestState.inventory}
        shippingBin={harvestState.shippingBin}
        onShipItem={handleShipItem}
        onSettleShipping={handleSettleShipping}
      />

      <ShippingSettlementModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        settlementData={settlementData}
      />

      <TownBulletinModal
        isOpen={isBulletinOpen}
        onClose={() => setIsBulletinOpen(false)}
        commissions={harvestState.dailyCommissions}
        onClaimCommission={handleClaimCommission}
        onGoPractice={handleWaterWithPractice}
      />

      <CoOanhManorModal
        isOpen={isCoOanhOpen}
        onClose={() => setIsCoOanhOpen(false)}
        friendship={harvestState.coOanhFriendship}
        userInventory={harvestState.inventory}
      />

      <GeneralStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        userGold={harvestState.gold}
        onBuyItem={handleBuyStoreItem}
        ownedDecor={harvestState.ownedDecor}
      />

      {isRevivalOpen && (
        <RevivalQuestModal
          isOpen={isRevivalOpen}
          onClose={() => setIsRevivalOpen(false)}
          onCompleteQuest={handleCompleteRevival}
        />
      )}

    </div>
  );
}
