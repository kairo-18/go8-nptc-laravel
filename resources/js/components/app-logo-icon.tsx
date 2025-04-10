import NPTCLogo from '../../../public/assets/NPTC_Logo.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <>
            <img src={NPTCLogo} alt="logo" className="h-full w-full object-contain" />
        </>
    );
}
