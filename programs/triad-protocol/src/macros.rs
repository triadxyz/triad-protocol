#[macro_export]
macro_rules! declare_vault_seeds {
    ( $vault_loader:expr, $name: ident ) => {
        let vault = $vault_loader;
        let name = &vault.name;
        let bump = vault.bump;
        let $name = &[&Vault::get_vault_signer_seeds(&name.as_bytes(), &bump)[..]];
    };
}
