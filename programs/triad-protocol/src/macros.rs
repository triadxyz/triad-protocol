#[macro_export]
macro_rules! declare_vault_seeds {
    ( $vault_loader:expr, $ticker: ident ) => {
        let vault = $vault_loader;
        let ticker = &vault.ticker;
        let bump = vault.bump;
        let $ticker = &[&Vault::get_vault_signer_seeds(&ticker, &bump)[..]];
    };
}
