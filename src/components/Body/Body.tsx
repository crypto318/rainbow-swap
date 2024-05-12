import {useEffect, useState} from 'react';

import styles from './Body.module.css';
import {ChevronDownIcon} from '../../assets/icons/ChevronDownIcon/ChevronDownIcon';
import {ChevronUpIcon} from '../../assets/icons/ChevronUpIcon/ChevronUpIcon';
import {useAssetsContext} from '../../context/assets/assets.hook';
import {useModalContext} from '../../context/modal/modal.hook';
import {useSwapRoute} from '../../hooks/use-swap-route.hook';
import {useTonUI} from '../../hooks/use-ton-ui.hook';
import {RouteStepWithCalculation} from '../../interfaces/route-step-with-calculation.interface';
import {CustomInput} from '../../shared/CustomInput/CustomInput';
import {ExchangeInfo} from '../../shared/ExchangeInfo/ExchangeInfo';
import {FormButton} from '../../shared/FormButton/FormButton';
import {InputOutputSelector} from '../../shared/InputOutputSelector/InputOutputSelector';
import {getClassName} from '../../utils/style.utils';

export const Body = () => {
    const [routeInfoOpen, setRouteInfoOpen] = useState(false);
    const [showRoute, setShowRoute] = useState(false);
    const [routeSteps, setRouteSteps] = useState<RouteStepWithCalculation[]>(
        []
    );
    const {wallet, connectWallet} = useTonUI();
    const swapRoute = useSwapRoute();
    const {setOutputModalOpen, setInputModalOpen} = useModalContext();
    const {
        inputAsset,
        outputAsset,
        inputAssetAmount,
        setInputAsset,
        setOutputAsset,
        setInputAssetAmount
    } = useAssetsContext();

    const openOutputModal = () => {
        setOutputModalOpen(true);
    };

    const openShowRoute = () => {
        setShowRoute(prev => !prev);
    };

    const openInputModal = () => {
        setInputModalOpen(true);
    };

    const onSwapAssets = () => {
        setInputAssetAmount('');
        setRouteInfoOpen(false);

        const temp = inputAsset;
        setInputAsset(outputAsset);
        setOutputAsset(temp);
    };

    const sendSwapRequest = () => {
        setRouteInfoOpen(true);
        if (inputAsset && outputAsset && inputAssetAmount !== '') {
            const amount = BigInt(
                parseFloat(inputAssetAmount) *
                    10 ** parseFloat(inputAsset.decimals)
            );
            swapRoute.loadData(amount, inputAsset.address, outputAsset.address);
    const handleLoadButtonClick = () => {
        if (inputAsset && outputAsset) {
            const amount = BigInt(parseFloat(inputAssetAmount) * 1e9);
            swapRouteBatch.loadData(
                amount,
                inputAsset.address,
                outputAsset.address
            );
        }
    };

    const handleSwapButtonClick = async () => {
        const senderAddress = tonConnectUI.wallet?.account.address ?? '';

        const messages = await Promise.all(
            swapRouteBatch.data.map(swapRoute =>
                swapRoute.getMessage(Address.parse(senderAddress))
            )
        );

        tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 1 * 60,
            from: senderAddress,
            messages
        });
    };

    const openNeededAssetModal = () => {
        if (!inputAsset) {
            openInputModal();
        } else {
            openOutputModal();
        }
    };

    useEffect(() => {
        console.log('swapRoute.isLoading', swapRoute.isLoading);
    }, [swapRoute.isLoading]);

    useEffect(() => {
        if (swapRoute.data) {
            swapRoute.data.forEach(route => {
                const routeStep = route.getRoute();
                setRouteSteps(routeStep);
            });
        }
    }, [swapRoute.data]);

    return (
        <>
            <div className={styles.body_div}>
                <CustomInput
                    text="You pay"
                    asset={inputAsset}
                    value={inputAssetAmount}
                    onClick={openInputModal}
                    onChange={setInputAssetAmount}
                />
                <InputOutputSelector onClick={onSwapAssets} />
                <CustomInput
                    text="You receive"
                    asset={outputAsset}
                    isOutput={true}
                    onClick={openOutputModal}
                />
            </div>
            {wallet ? (
                outputAsset && inputAsset ? (
                    <>
                        <FormButton
                            text="Load"
                            type="button"
                            onClick={handleLoadButtonClick}
                            className={getClassName(
                                styles.body_button,
                                styles.swap_button
                            )}
                        />
                        <FormButton
                            text="Swap"
                            type="button"
                            onClick={handleSwapButtonClick}
                            className={getClassName(
                                styles.body_button,
                                styles.swap_button
                            )}
                        />
                    </>
                ) : (
                    <FormButton
                        text="Select an asset"
                        type="button"
                        onClick={openNeededAssetModal}
                        className={getClassName(
                            styles.body_button,
                            styles.select_button
                        )}
                    />
                )
            ) : (
                <FormButton
                    text="Connect Wallet"
                    type="button"
                    onClick={connectWallet}
                    className={getClassName(
                        styles.body_button,
                        styles.connect_button
                    )}
                />
            )}
            {inputAsset && outputAsset ? (
                <ExchangeInfo
                    inputAsset={inputAsset}
                    outputAsset={outputAsset}
                />
            ) : null}
            {routeInfoOpen && swapRoute.data ? (
                <div className={styles.route_info_div}>
                    <div className={styles.route_info_inside_div}>
                        <p>{inputAsset?.symbol} sell price</p>
                        <p>
                            {inputAssetAmount} {inputAsset?.symbol}
                        </p>
                    </div>
                    <div className={styles.route_info_inside_div}>
                        <p>{outputAsset?.symbol} sell price</p>
                        <p>??? {outputAsset?.symbol}</p>
                    </div>
                    <div className={styles.route_info_inside_div}>
                        <p>Network fee</p>
                        <p>??? {outputAsset?.symbol} ($?.??)</p>
                    </div>
                    <div className={styles.route_info_inside_div}>
                        <p>Swap route</p>
                        <div onClick={openShowRoute}>
                            <p>? chains/? dexes</p>
                            {showRoute ? (
                                <ChevronUpIcon width="19px" height="19px" />
                            ) : (
                                <ChevronDownIcon width="19px" height="19px" />
                            )}
                        </div>
                    </div>
                    {showRoute ? (
                        <div>
                            {routeSteps.map((routeSteps, index) => {
                                return (
                                    <div key={index}>
                                        {routeSteps.inputAssetAddress} {'>'}
                                        {routeSteps.outputAssetAddress}
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </>
    );
};
