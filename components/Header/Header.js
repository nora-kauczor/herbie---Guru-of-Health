
import Login from "../Login/Login"
import { HeaderWrapper, AppName } from "./Header.styles"


export function Header(){
    return (<HeaderWrapper>
                <Login/>
            <AppName>herbie</AppName>
            </HeaderWrapper>)
}