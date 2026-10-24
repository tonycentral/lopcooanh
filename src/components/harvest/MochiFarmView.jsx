import React, { useState } from 'react';
import HarvestHUD from './HarvestHUD';
import HarvestTownMap from './HarvestTownMap';
import HarvestToolbar from './HarvestToolbar';
import SeedPouchModal from './SeedPouchModal';
import ShippingSettlementModal from './ShippingSettlementModal';
import TownBulletinModal from './TownBulletinModal';
import CoOanhManorModal from './CoOanhManorModal';
import GeneralStoreModal from './GeneralStoreModal';
import BackpackModal from './BackpackModal';
import RevivalQuestModal from '../farm/RevivalQuestModal';
import { 
  getHarvestTownState, 
  saveHarvestTownState,
  plantSeed, 
  harvestCrop, 
  shipItemFromBackpack, 
  settleShippingBin, 
  claimCommissionReward, 
  buyGeneralStoreItem, 
  clearWeedsWithRevival 
} from '../../services/harvestTownService';
import { sounds } from '../../services/soundEffects';

export default function MochiFarmView({
  studentEmail,
  onOpenTargetBandModal,
  onGoWritingPractice,
  onGoFullEssay,
  onGoVocabulary,
  onGoFlashcard,
  onGoGrammar,
  onGoReading,
  onGoListening
}) {
  const [harvestState, setHarvestState] = useState(() => getHarvestTownState(studentEmail));
  const [activeTool, setActiveTool] = useState('hoe');

  // Modals state
  const [isSeedPouchOpen, setIsSeedPouchOpen] = useState(false);
  const [selectedPlotForSeed, setSelectedPlotForSeed] = useState(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [settlementData, setSettlementData] = useState(null);
  const [isBulletinOpen, setIsBulletinOpen] = useState(false);
  const [isCoOanhOpen, setIsCoOanhOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isRevivalOpen, setIsRevivalOpen] = useState(false);

  // 1. Gieo Hạt
  const handlePlant = (cropKey, plotId) => {
    if (!plotId) return;
    const res = plantSeed(plotId, cropKey, studentEmail);
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
    }
  };

  // 3. Tưới nước bằng luyện tập
  const handleWaterWithPractice = (skillType) => {
    if (skillType === 'vocab' && onGoVocabulary) onGoVocabulary();
    else if (skillType === 'grammar' && onGoGrammar) onGoGrammar();
    else if (skillType === 'task1' && onGoWritingPractice) onGoWritingPractice('task1');
    else if (skillType === 'task2' && onGoFullEssay) onGoFullEssay();
    else if (skillType === 'reading' && onGoReading) onGoReading();
    else if (skillType === 'pronunciation' && onGoFlashcard) onGoFlashcard();
    else if (onGoVocabulary) onGoVocabulary();
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
    <div className="flex-1 flex flex-col min-h-0 bg-[#E8F5E9]/50 overflow-y-auto pb-24 relative select-none font-sans">
      
      {/* 1. RETRO HUD (Top Bar) */}
      <HarvestHUD
        state={harvestState}
        onOpenTargetBandModal={onOpenTargetBandModal}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenBulletin={() => setIsBulletinOpen(true)}
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
        onOpenMines={() => onGoReading ? onGoReading() : null}
        onOpenFishing={() => onGoFlashcard ? onGoFlashcard() : null}
        onClearWeeds={() => setIsRevivalOpen(true)}
      />

      {/* 3. RETRO BOTTOM HOTBAR (Toolbelt) */}
      <HarvestToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onOpenSeedPouch={() => {
          setSelectedPlotForSeed(null);
          setIsSeedPouchOpen(true);
        }}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onOpenBulletin={() => setIsBulletinOpen(true)}
        onOpenFishing={() => onGoFlashcard ? onGoFlashcard() : null}
        onOpenMines={() => onGoReading ? onGoReading() : null}
        unclaimedQuestsCount={unclaimedCommissionsCount}
        shippingCount={harvestState.shippingBin?.length || 0}
      />

      {/* MODALS */}
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
