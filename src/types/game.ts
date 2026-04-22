export type UserId = string;
export type MatchId = string;
export type AssetId = string;
export type CardId = string;
export type TokenId = string;
export type TileIndex = number;

export interface AssetCard {
    id: AssetId;
    name: string;
    purchase_cost: number;
    profit_per_return: number;
    max_returns: number;
}

export interface SpendingCard {
    id: CardId;
    name: string;
    line_items: { label: string; cost: number }[];
    total: number;
}

export interface SavingsCard {
    id: CardId;
    name: string;
    description: string;
    save_threshold: number;
    bonus_if_met: number;
    bonus_condition?: string;
    threshold_operator?: 'greater_than' | 'equals' | 'greater_than_or_equal';
    bonus_condition_value?: number | string;
    bonus_condition_text?: string;
}

export interface PlayingCard {
    id: CardId;
    label: string;
    delta: number;
    type: 'gain' | 'loss' | 'conditional';
}

export interface BoardTile {
    index: TileIndex;
    isYellow: boolean;
    isAssetSpace: boolean;
    assetId?: AssetId;
}

export interface Token {
    id: TokenId;
    playerId: UserId;
    position: TileIndex;
    color: string;
}

export interface PlayerAsset {
    assetId: AssetId;
    purchasedOnTurn: number;
    purchasedAtTile: number;
    returnsCollected: number;
    maxReturns?: number;
    lastReturnTile: TileIndex | null;
    active?: boolean;
}

export interface PlayerState {
    userId: UserId;
    displayName: string;
    avatar?: string;
    profession?: string;
    onHandPoints: number;
    savings: number;
    liabilities: number;
    assets: PlayerAsset[];
    tokens: Token[];
    spendingCards: SpendingCard[];
    savingsCards: SavingsCard[];
    playedSpendingCards?: SpendingCard[];
    playedSavingsCards?: SavingsCard[];
    seatIndex: number;
    direction?: number; // +1 for 1->80, -1 for 80->1
    hasRolled: boolean;
    hasPlayedSpendingCard?: boolean;
    selectedAssets: AssetId[];
}

export type GamePhase = 'LOBBY' | 'PRE_GAME' | 'IN_PROGRESS' | 'END_GAME' | 'POST_GAME';
export type TurnPhase = 'WAIT_FOR_ROLL' | 'WAIT_FOR_TOKEN_SELECT' | 'MOVING' | 'RESOLVING' | 'READY_TO_END_TURN' | 'END_TURN' | 'WAIT_FOR_ASSET_PICK';

export interface DiceResult {
    die1: number;
    die2: number;
    total: number;
    seed: number;
}

export interface DraftState {
    picksQueue: UserId[];
    pickPointer: number;
    currentPickerUserId: UserId | null;
    availableAssets: AssetCard[];
}

export interface GameState {
    matchId: MatchId;
    phase: GamePhase;
    turnPhase: TurnPhase;
    players: PlayerState[];
    currentPlayerIndex: number;
    turnNumber: number;
    board: BoardTile[];
    diceResult: DiceResult | null;
    winnerId: UserId | null;
    dreamId: string;
    dreamCost?: number;
    assetsPool: AssetCard[];
    playingDeck: PlayingCard[];
    draft?: DraftState;
}
