module basic_move::basic_move;

use std::string::String;

public struct Hero has key, store {
    id: object::UID,
    name: String,
}

public struct InsignificantWeapon has drop, store {
    power: u8,
}

public struct Weapon has store {
    power: u8,
}

public fun create_weapon(power: u8): Weapon {
    Weapon { power }
}

public fun mint_hero(ctx: &mut TxContext, name: String): Hero {
    let hero = Hero { id: object::new(ctx), name };
    hero
}

public fun create_insignificant_weapon(power: u8): InsignificantWeapon {
    InsignificantWeapon { power }
}

#[test_only]
use sui::test_scenario;

#[test]
fun test_mint() {
    let mut test = test_scenario::begin(@0xCAFE);
    let hero = mint_hero(test.ctx(), b"Hii".to_string());
    assert!(hero.name == b"Hii".to_string(), 111);
    let Hero { id: id, name: _ } = hero;
    object::delete(id);
    test.end();
}

#[test_only]
use sui::test_utils::destroy;

#[test]
fun test_drop_semantics() {
    let insignificant_weapon = create_insignificant_weapon(42);
    let mut _insignificant_weapon2 = create_insignificant_weapon(23);
    _insignificant_weapon2 = create_insignificant_weapon(56);
    assert!(_insignificant_weapon2.power == 56, 333);
    assert!(insignificant_weapon.power == 42, 444);

    let weapon = create_weapon(99);
    destroy(weapon);
}
