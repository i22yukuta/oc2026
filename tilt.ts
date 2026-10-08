// 実機で数値の変化を確認できた内蔵センサーを直接読む。
// この実機では controller.acceleration() の値が変わらなかったため。
// ゲーム本体と分けることで、main.ts をブロックへ変換しても
// I2C / Buffer の処理を変換する必要がない。
namespace userconfig {
    // 外部端子 P16 / P8 とは別の、MCU 内部配線 P0.16 / P0.8。
    export const PIN_ACCELEROMETER_SDA = 16
    export const PIN_ACCELEROMETER_SCL = 8
}

//% color="#267CBA" icon="\uf11b" block="傾き操作" weight=90
namespace retroTilt {
    let simulated = false
    let ready = false
    let bus: I2C = null
    let valueX = 0
    let valueY = 0

    function readRegisters(reg: number, count: number): Buffer {
        if (!bus) return null
        let command = pins.createBuffer(1)
        command[0] = reg
        // LSM303AGR の加速度計の 7 ビット I2C アドレス。
        if (bus.writeBuffer(0x19, command, true) != 0) return null
        return bus.readBuffer(0x19, count)
    }

    function writeRegister(reg: number, value: number): boolean {
        if (!bus) return false
        let command = pins.createBuffer(2)
        command[0] = reg
        command[1] = value
        return bus.writeBuffer(0x19, command) == 0
    }

    /** 傾き入力を準備する。実機とシミュレーターを自動で切り替える。 */
    //% blockId=retro_tilt_initialize block="傾き入力を準備する" weight=100
    export function initialize(): boolean {
        ready = false
        valueX = 0
        valueY = 0
        // 公式のシミュレーター識別値。実機のセンサー故障と混同しない。
        simulated = control.deviceDalVersion() == "sim"
        if (simulated) {
            // 初回の読み取りで、シミュレーターの傾き入力を有効にする。
            controller.acceleration(ControllerDimension.X)
            controller.acceleration(ControllerDimension.Y)
            ready = true
            return true
        }
        // 実機のときだけ内部ピンを取得し、I2C を開く。
        let sda = pins.pinByCfg(DAL.CFG_PIN_ACCELEROMETER_SDA)
        let scl = pins.pinByCfg(DAL.CFG_PIN_ACCELEROMETER_SCL)
        if (!sda || !scl) return false
        bus = pins.createI2C(sda, scl)
        // 対象のセンサーであることを確認してから設定を書き込む。
        let identity = readRegisters(0x0f, 1)
        if (!identity || identity.length != 1 || identity[0] != 0x33) return false
        // CTRL_REG1: 100 Hz、全軸有効。
        if (!writeRegister(0x20, 0x57)) return false
        // CTRL_REG4: 読み取り中の更新を抑止、高分解能、±2 g。
        ready = writeRegister(0x23, 0x88)
        return ready
    }

    /** X / Y を一度に更新する。失敗した回は false を返し、移動を行わない。 */
    //% blockId=retro_tilt_read block="傾きを読み取れた" weight=90
    export function read(): boolean {
        if (!ready) return false
        if (simulated) {
            valueX = controller.acceleration(ControllerDimension.X)
            valueY = controller.acceleration(ControllerDimension.Y)
            return true
        }
        // 0x28 から 6 バイトを連続読み取り（アドレス自動増分で 0xa8）。
        let sample = readRegisters(0xa8, 6)
        if (!sample || sample.length != 6) return false
        // 符号付き 16 ビット、左詰め 12 ビット値。/16 で mg 単位になる。
        // 1000 mg = 1 g。X は元の向き、Y はユーザーの指定に合わせ上下反転。
        valueX = Math.round(sample.getNumber(NumberFormat.Int16LE, 0) / 16)
        valueY = -Math.round(sample.getNumber(NumberFormat.Int16LE, 2) / 16)
        return true
    }

    /** 横方向の加速度（mg）。正の値で右へ移動する。 */
    //% blockId=retro_tilt_x block="横の傾き（mg）" weight=80
    export function x(): number {
        return valueX
    }

    /** 縦方向の加速度（mg）。正の値で下へ移動する。 */
    //% blockId=retro_tilt_y block="縦の傾き（mg）" weight=70
    export function y(): number {
        return valueY
    }
}
