import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Icon from "@bit/vitorbarbosa19.ziro.icon";
import { useAnimatedLocation, useModal, useScroll } from "@bit/vitorbarbosa19.ziro.flow-manager";
import { container, headerTitle, priceButton, inputPlaceholder } from "./styles";
import SearchBar from "./searchBar";
import PriceTable from "../GalleryBrand/priceTable";
import { useUserData } from "../useInfo";

const commonProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const HeaderWithoutModal = ({ title, onClickTitle = undefined, shadow = false, leftButton }) => {
    return (
        <div style={{ ...container, ...{ gridTemplateColumns: "1fr 10fr 1fr", boxShadow: shadow ? container.boxShadow : undefined } }}>
            <div>
                {leftButton && (
                    <motion.div {...commonProps} whileTap={{ scale: 0.95 }} onClick={leftButton.onClick}>
                        <Icon type={leftButton.icon} size={18} />
                    </motion.div>
                )}
            </div>
            <div>
                {title && (
                    <motion.div {...commonProps} style={{ display: "grid" }} onClick={onClickTitle}>
                        <label style={headerTitle}>{title}</label>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const Header = ({ title, featuredPrices, backPath, onSearch, soloTitle, excludeItem, onClickTitle, containerStyle = {}, backpathIcon }) => {
    const [{ uid }] = useUserData();
    const [, setLocation] = useAnimatedLocation();
    const [isPriceTableOpen, setPriceTableOpen] = useState(false);

    useModal(
        <PriceTable
            isPriceTableOpen={isPriceTableOpen}
            setPriceTableOpen={setPriceTableOpen}
            brand="Preços"
            price={false}
            uid={uid}
            featured={featuredPrices}
            soloTitle={soloTitle}
        />,
        [isPriceTableOpen],
    );
    useScroll(!isPriceTableOpen);

    if (onSearch)
        return (
            <div style={{ ...container, gridTemplateColumns: "1fr" }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "grid" }}>
                    <style>{inputPlaceholder}</style>
                    <SearchBar onChange={onSearch} />
                </motion.div>
            </div>
        );

    return (
        <div style={{ ...container, ...containerStyle }}>
            <div>
                {backPath && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocation("goRight", backPath)}
                    >
                        <Icon type={backpathIcon || "back"} size={18} />
                    </motion.div>
                )}
            </div>
            <div>
                {title && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "grid" }}
                        onClick={onClickTitle}
                    >
                        <label style={headerTitle}>{title}</label>
                    </motion.div>
                )}
            </div>
            <div>
                {featuredPrices && !uid && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPriceTableOpen(true)}
                        style={priceButton}
                    >
                        <label style={{ fontSize: "12px" }}>Preços</label>
                    </motion.div>
                )}
                {excludeItem && (
                    <motion.div
                        style={{ display: "grid", justifyContent: "end" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={excludeItem}
                    >
                        <Icon type="trash" size={20} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Header.propTypes = {
//   title: PropTypes.string,
//   filter: PropTypes.bool,
//   backPath: PropTypes.string,
//   onSearch: PropTypes.func,
// };

export default Header;
