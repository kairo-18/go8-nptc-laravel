import NPTCLogo from "../../../public/assets/NPTCLogo.png"

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src={NPTCLogo} alt="logo" className=" h-full w-full object-contain"/>
    );
}
